import React from 'react';
import {
  Search, 
  Mic, 
  Sparkles, 
  Globe, 
  Mail, 
  Star, 
  User, 
  Send, 
  MapPin, 
  Compass, 
  Navigation, 
  Map, 
  Image, 
  Heart, 
  Grid, 
  Settings, 
  Calendar, 
  Clock, 
  Plus, 
  List, 
  HardDrive, 
  FolderPlus, 
  UploadCloud, 
  Eye, 
  Share2, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  DollarSign, 
  Wallet, 
  Play, 
  Bell, 
  Tv, 
  ThumbsUp, 
  ArrowLeft, 
  RotateCw, 
  MoreVertical, 
  Notebook, 
  Pin, 
  CheckSquare, 
  Archive, 
  Trash,
  HelpCircle,
  Folder
} from 'lucide-react';

export const IconMap: Record<string, React.ComponentType<any>> = {
  Search, 
  Mic, 
  Sparkles, 
  Globe, 
  Mail, 
  Star, 
  User, 
  Send, 
  MapPin, 
  Compass, 
  Navigation, 
  Map, 
  Image, 
  Heart, 
  Grid, 
  Settings, 
  Calendar, 
  Clock, 
  Plus, 
  List, 
  HardDrive, 
  FolderPlus, 
  UploadCloud, 
  Eye, 
  Share2, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  DollarSign, 
  Wallet, 
  Play, 
  Bell, 
  Tv, 
  ThumbsUp, 
  ArrowLeft, 
  RotateCw, 
  MoreVertical, 
  Notebook, 
  Pin, 
  CheckSquare, 
  Archive, 
  Trash,
  HelpCircle,
  Folder
};

export type PieceShape = 
  | 'pill' 
  | 'circle' 
  | 'rect' 
  | 'button' 
  | 'square' 
  | 'nav' 
  | 'video' 
  | 'post';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PuzzlePieceConfig {
  id: string;
  label: string;
  iconName: string;
  shape: PieceShape;
}

export interface PuzzleSlotConfig {
  pieceId: string;
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface Puzzle {
  id: string;
  name: string;
  difficulty: Difficulty;
  brandColor: string;
  pieces: PuzzlePieceConfig[];
  slots: PuzzleSlotConfig[];
  previewImage: string; // Used to hold thumbnail representation
  estimatedTime: number; // in seconds
  scoreMultiplier: number;
}

export const puzzles: Puzzle[] = [
  // ---------------- EASY PUZZLES (x1.0 Multiplier) ----------------
  {
    id: 'google-search',
    name: 'Google Search',
    difficulty: 'easy',
    brandColor: '#4285F4',
    estimatedTime: 15,
    scoreMultiplier: 1.0,
    previewImage: 'Search',
    pieces: [
      { id: 'piece-google-logo', label: 'Google Wordmark', iconName: 'Globe', shape: 'rect' },
      { id: 'piece-search-bar', label: 'Search bar input', iconName: 'Search', shape: 'pill' },
      { id: 'piece-mic-icon', label: 'Voice microphone', iconName: 'Mic', shape: 'circle' },
      { id: 'piece-btn-search', label: 'Google Search', iconName: 'Search', shape: 'button' },
      { id: 'piece-btn-lucky', label: 'I\'m Feeling Lucky', iconName: 'Sparkles', shape: 'button' },
    ],
    slots: [
      { pieceId: 'piece-google-logo', top: '18%', left: '15%', width: '70%', height: '11%' },
      { pieceId: 'piece-search-bar', top: '35%', left: '6%', width: '88%', height: '10%' },
      { pieceId: 'piece-mic-icon', top: '36%', left: '80%', width: '11%', height: '8%' },
      { pieceId: 'piece-btn-search', top: '50%', left: '8%', width: '40%', height: '8%' },
      { pieceId: 'piece-btn-lucky', top: '50%', left: '52%', width: '40%', height: '8%' },
    ],
  },
  {
    id: 'gmail-compose',
    name: 'Gmail Compose',
    difficulty: 'easy',
    brandColor: '#EA4335',
    estimatedTime: 25,
    scoreMultiplier: 1.0,
    previewImage: 'Mail',
    pieces: [
      { id: 'piece-gmail-search', label: 'Search in Mail', iconName: 'Mail', shape: 'pill' },
      { id: 'piece-gmail-avatar', label: 'Sender Profile', iconName: 'User', shape: 'circle' },
      { id: 'piece-gmail-email', label: 'Inbox Email card', iconName: 'Inbox', shape: 'rect' },
      { id: 'piece-gmail-star', label: 'Star mail marker', iconName: 'Star', shape: 'circle' },
      { id: 'piece-gmail-fab', label: 'Compose Button', iconName: 'Send', shape: 'button' },
    ],
    slots: [
      { pieceId: 'piece-gmail-search', top: '4%', left: '6%', width: '88%', height: '9%' },
      { pieceId: 'piece-gmail-avatar', top: '4.5%', left: '80%', width: '11%', height: '8%' },
      { pieceId: 'piece-gmail-email', top: '18%', left: '0%', width: '100%', height: '14%' },
      { pieceId: 'piece-gmail-star', top: '21%', left: '86%', width: '8%', height: '6%' },
      { pieceId: 'piece-gmail-fab', top: '76%', left: '58%', width: '36%', height: '8%' },
    ],
  },
  {
    id: 'google-photos',
    name: 'Google Photos',
    difficulty: 'easy',
    brandColor: '#34A853',
    estimatedTime: 20,
    scoreMultiplier: 1.0,
    previewImage: 'Image',
    pieces: [
      { id: 'piece-photos-logo', label: 'Photos Wordmark', iconName: 'Image', shape: 'rect' },
      { id: 'piece-photos-grid', label: 'Featured Photo', iconName: 'Image', shape: 'square' },
      { id: 'piece-photos-heart', label: 'Favorite Heart', iconName: 'Heart', shape: 'circle' },
      { id: 'piece-photos-search', label: 'Explore search tab', iconName: 'Search', shape: 'pill' },
      { id: 'piece-photos-settings', label: 'Gallery Settings', iconName: 'Settings', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-photos-logo', top: '2%', left: '6%', width: '45%', height: '9%' },
      { pieceId: 'piece-photos-grid', top: '15%', left: '8%', width: '84%', height: '48%' },
      { pieceId: 'piece-photos-heart', top: '53%', left: '76%', width: '12%', height: '7%' },
      { pieceId: 'piece-photos-search', top: '68%', left: '6%', width: '88%', height: '9%' },
      { pieceId: 'piece-photos-settings', top: '2.5%', left: '82%', width: '11%', height: '8%' },
    ],
  },

  // ---------------- MEDIUM PUZZLES (x1.5 Multiplier) ----------------
  {
    id: 'google-maps',
    name: 'Google Maps',
    difficulty: 'medium',
    brandColor: '#FBBC05',
    estimatedTime: 30,
    scoreMultiplier: 1.5,
    previewImage: 'MapPin',
    pieces: [
      { id: 'piece-maps-search', label: 'Search Maps input', iconName: 'Search', shape: 'pill' },
      { id: 'piece-maps-pin', label: 'Location Pin marker', iconName: 'MapPin', shape: 'circle' },
      { id: 'piece-maps-compass', label: 'Compass orientation', iconName: 'Compass', shape: 'circle' },
      { id: 'piece-maps-navigate', label: 'Get Directions', iconName: 'Navigation', shape: 'button' },
      { id: 'piece-maps-nav', label: 'Bottom tab menu', iconName: 'Map', shape: 'nav' },
    ],
    slots: [
      { pieceId: 'piece-maps-search', top: '4%', left: '6%', width: '88%', height: '9%' },
      { pieceId: 'piece-maps-pin', top: '35%', left: '42%', width: '16%', height: '11%' },
      { pieceId: 'piece-maps-compass', top: '65%', left: '80%', width: '12%', height: '8%' },
      { pieceId: 'piece-maps-navigate', top: '76%', left: '50%', width: '44%', height: '8%' },
      { pieceId: 'piece-maps-nav', top: '88%', left: '0%', width: '100%', height: '12%' },
    ],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    difficulty: 'medium',
    brandColor: '#4285F4',
    estimatedTime: 30,
    scoreMultiplier: 1.5,
    previewImage: 'Calendar',
    pieces: [
      { id: 'piece-cal-header', label: 'Calendar Month view', iconName: 'Calendar', shape: 'rect' },
      { id: 'piece-cal-clock', label: 'Time display bar', iconName: 'Clock', shape: 'pill' },
      { id: 'piece-cal-event', label: 'Event Schedule block', iconName: 'List', shape: 'rect' },
      { id: 'piece-cal-fab', label: 'Add Event FAB', iconName: 'Plus', shape: 'circle' },
      { id: 'piece-cal-avatar', label: 'Participant User', iconName: 'User', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-cal-header', top: '2%', left: '4%', width: '92%', height: '10%' },
      { pieceId: 'piece-cal-clock', top: '15%', left: '6%', width: '45%', height: '7%' },
      { pieceId: 'piece-cal-event', top: '26%', left: '0%', width: '100%', height: '14%' },
      { pieceId: 'piece-cal-fab', top: '75%', left: '76%', width: '16%', height: '10%' },
      { pieceId: 'piece-cal-avatar', top: '29%', left: '84%', width: '10%', height: '8%' },
    ],
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    difficulty: 'medium',
    brandColor: '#34A853',
    estimatedTime: 35,
    scoreMultiplier: 1.5,
    previewImage: 'HardDrive',
    pieces: [
      { id: 'piece-drive-search', label: 'Search in Drive', iconName: 'Search', shape: 'pill' },
      { id: 'piece-drive-folder', label: 'Create Folder key', iconName: 'FolderPlus', shape: 'button' },
      { id: 'piece-drive-upload', label: 'Upload Cloud widget', iconName: 'UploadCloud', shape: 'circle' },
      { id: 'piece-drive-file', label: 'File Preview thumbnail', iconName: 'Eye', shape: 'square' },
      { id: 'piece-drive-share', label: 'Collaborator Share', iconName: 'Share2', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-drive-search', top: '4%', left: '6%', width: '88%', height: '9%' },
      { pieceId: 'piece-drive-folder', top: '17%', left: '8%', width: '45%', height: '8%' },
      { pieceId: 'piece-drive-upload', top: '17%', left: '78%', width: '14%', height: '9%' },
      { pieceId: 'piece-drive-file', top: '30%', left: '8%', width: '84%', height: '42%' },
      { pieceId: 'piece-drive-share', top: '75%', left: '78%', width: '14%', height: '9%' },
    ],
  },

  // ---------------- HARD PUZZLES (x2.0 Multiplier) ----------------
  {
    id: 'google-pay',
    name: 'Google Pay',
    difficulty: 'hard',
    brandColor: '#4285F4',
    estimatedTime: 45,
    scoreMultiplier: 2.0,
    previewImage: 'Wallet',
    pieces: [
      { id: 'piece-pay-logo', label: 'Google Pay Logo', iconName: 'Wallet', shape: 'rect' },
      { id: 'piece-pay-qr', label: 'Scan QR Code action', iconName: 'QrCode', shape: 'circle' },
      { id: 'piece-pay-send', label: 'Send Money contact', iconName: 'Send', shape: 'button' },
      { id: 'piece-pay-card', label: 'Visa Credit Card widget', iconName: 'CreditCard', shape: 'square' },
      { id: 'piece-pay-shield', label: 'Secure Transaction', iconName: 'ShieldCheck', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-pay-logo', top: '2%', left: '4%', width: '40%', height: '8%' },
      { pieceId: 'piece-pay-qr', top: '2%', left: '80%', width: '14%', height: '9%' },
      { pieceId: 'piece-pay-card', top: '16%', left: '10%', width: '80%', height: '46%' },
      { pieceId: 'piece-pay-send', top: '66%', left: '10%', width: '80%', height: '8%' },
      { pieceId: 'piece-pay-shield', top: '78%', left: '43%', width: '14%', height: '9%' },
    ],
  },
  {
    id: 'youtube-home',
    name: 'YouTube Home',
    difficulty: 'hard',
    brandColor: '#FF0000',
    estimatedTime: 40,
    scoreMultiplier: 2.0,
    previewImage: 'Tv',
    pieces: [
      { id: 'piece-yt-header', label: 'YouTube Header logo', iconName: 'Tv', shape: 'rect' },
      { id: 'piece-yt-video', label: 'Primary Video feed', iconName: 'Play', shape: 'video' },
      { id: 'piece-yt-channel', label: 'Channel subscribe', iconName: 'Bell', shape: 'button' },
      { id: 'piece-yt-nav', label: 'Bottom menu panel', iconName: 'Home', shape: 'nav' },
      { id: 'piece-yt-rating', label: 'Thumbs Up Rating', iconName: 'ThumbsUp', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-yt-header', top: '2%', left: '4%', width: '40%', height: '8%' },
      { pieceId: 'piece-yt-video', top: '12%', left: '0%', width: '100%', height: '36%' },
      { pieceId: 'piece-yt-channel', top: '51%', left: '66%', width: '30%', height: '8%' },
      { pieceId: 'piece-yt-rating', top: '51%', left: '4%', width: '12%', height: '8%' },
      { pieceId: 'piece-yt-nav', top: '88%', left: '0%', width: '100%', height: '12%' },
    ],
  },
  {
    id: 'chrome-tab',
    name: 'Chrome New Tab',
    difficulty: 'hard',
    brandColor: '#34A853',
    estimatedTime: 40,
    scoreMultiplier: 2.0,
    previewImage: 'Globe',
    pieces: [
      { id: 'piece-chrome-logo', label: 'Chrome Multi-color Logo', iconName: 'Globe', shape: 'circle' },
      { id: 'piece-chrome-url', label: 'Search or Type URL input', iconName: 'Globe', shape: 'pill' },
      { id: 'piece-chrome-refresh', label: 'Reload webpage key', iconName: 'RotateCw', shape: 'circle' },
      { id: 'piece-chrome-back', label: 'Back history navigation', iconName: 'ArrowLeft', shape: 'circle' },
      { id: 'piece-chrome-more', label: 'Menu settings details', iconName: 'MoreVertical', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-chrome-logo', top: '16%', left: '38%', width: '24%', height: '14%' },
      { pieceId: 'piece-chrome-url', top: '35%', left: '6%', width: '88%', height: '9%' },
      { pieceId: 'piece-chrome-back', top: '48%', left: '16%', width: '12%', height: '8%' },
      { pieceId: 'piece-chrome-refresh', top: '48%', left: '44%', width: '12%', height: '8%' },
      { pieceId: 'piece-chrome-more', top: '48%', left: '72%', width: '12%', height: '8%' },
    ],
  },
  {
    id: 'google-keep',
    name: 'Google Keep',
    difficulty: 'hard',
    brandColor: '#FBBC05',
    estimatedTime: 35,
    scoreMultiplier: 2.0,
    previewImage: 'Notebook',
    pieces: [
      { id: 'piece-keep-search', label: 'Search Notes panel', iconName: 'Search', shape: 'pill' },
      { id: 'piece-keep-pin', label: 'Pin Note key icon', iconName: 'Pin', shape: 'circle' },
      { id: 'piece-keep-note', label: 'Grid Note board Card', iconName: 'Notebook', shape: 'post' },
      { id: 'piece-keep-todo', label: 'Checkbox Todo widget', iconName: 'CheckSquare', shape: 'rect' },
      { id: 'piece-keep-archive', label: 'Archive Notebook FAB', iconName: 'Archive', shape: 'circle' },
    ],
    slots: [
      { pieceId: 'piece-keep-search', top: '4%', left: '6%', width: '88%', height: '9%' },
      { pieceId: 'piece-keep-note', top: '18%', left: '6%', width: '88%', height: '34%' },
      { pieceId: 'piece-keep-pin', top: '21%', left: '80%', width: '10%', height: '7%' },
      { pieceId: 'piece-keep-todo', top: '56%', left: '6%', width: '88%', height: '10%' },
      { pieceId: 'piece-keep-archive', top: '75%', left: '76%', width: '16%', height: '10%' },
    ],
  },
];
