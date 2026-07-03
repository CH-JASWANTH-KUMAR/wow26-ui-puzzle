import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface QRPaymentScreenProps {
  sessionId: string;
  onSuccess: (userId: string) => void;
  onCancel: () => void;
}

export const QRPaymentScreen: React.FC<QRPaymentScreenProps> = ({
  sessionId,
  onSuccess,
  onCancel
}) => {
  const elapsedSecondsRef = useRef(0);
  const [hasConnectionIssue, setHasConnectionIssue] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const pollIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Start polling immediately
    const pollStatus = async () => {
      try {
        const response = await fetch(
          `https://now-in-google-backend-1010379975924.asia-south1.run.app/nowingoogle-backend/api/wallet/experience/status/${sessionId}`,
          {
            headers: {
              'x-api-version': '2.0.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setHasConnectionIssue(false);

        if (data && data.status) {
          const status = data.session_status;
          if (status === 'SUCCESS') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            // Retrieve user_id from response
            const userId = data.user_id || (data.data && data.data.user_id) || 'unknown_user';
            onSuccess(userId);
          } else if (status === 'FAILED' || status === 'CANCELLED') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            alert('Payment session failed or cancelled. Please try again.');
            onCancel();
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        setHasConnectionIssue(true);
      }
    };

    pollIntervalRef.current = setInterval(() => {
      elapsedSecondsRef.current += 2;
      if (elapsedSecondsRef.current >= 180) {
        // Timeout reached
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setIsExpired(true);
      } else {
        pollStatus();
      }
    }, 2000);

    // Initial poll
    pollStatus();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [sessionId, onSuccess, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#161a23] border border-zinc-700/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-google-blue/10 blur-3xl pointer-events-none"></div>

        {!isExpired ? (
          <>
            <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">
              Scan with WOW App to Begin
            </h3>
            <p className="text-xs text-zinc-400 mb-6 max-w-[300px] leading-relaxed">
              Open your WOW 2026 app &rarr; scan this code &rarr; confirm to start
            </p>

            {/* QR Code Container with Quiet Zone */}
            <div className="bg-white p-5 rounded-2xl shadow-xl mb-6 relative group transition-transform duration-300 hover:scale-[1.02]">
              <QRCodeSVG
                value={`wow2026:experience:${sessionId}`}
                size={220}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Status Indicator / Connection Warning */}
            <div className="flex flex-col items-center justify-center gap-2 mb-8 min-h-[48px]">
              {hasConnectionIssue ? (
                <div className="flex items-center gap-2 text-google-yellow text-xs font-bold bg-google-yellow/10 border border-google-yellow/20 px-4 py-2 rounded-xl">
                  <WifiOff className="w-4 h-4 animate-bounce" />
                  <span>Connection issue &mdash; retrying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-zinc-300 text-xs font-medium">
                  <Loader2 className="w-4 h-4 text-google-blue animate-spin" />
                  <span>Waiting for payment confirmation...</span>
                </div>
              )}
            </div>

            <Button
              onClick={onCancel}
              variant="outlined"
              size="md"
              className="w-full border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white font-bold"
            >
              Cancel
            </Button>

            {(hasConnectionIssue || sessionId.startsWith('mock_')) && (
              <Button
                onClick={() => onSuccess('mock_user')}
                variant="filled"
                size="md"
                className="w-full mt-3 bg-google-green text-white font-bold"
              >
                Proceed to Game (Offline)
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-google-red/10 border border-google-red/30 flex items-center justify-center mb-5 text-google-red">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-white mb-2">
              Session Expired
            </h3>
            <p className="text-xs text-zinc-400 mb-8 max-w-[280px] leading-relaxed">
              Please scan again. The 3-minute payment confirmation window has closed.
            </p>

            <Button
              onClick={onCancel}
              variant="filled"
              size="md"
              className="w-full bg-google-blue text-white font-bold shadow-md"
            >
              Try Again
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};
