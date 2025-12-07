import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tools from '../Tools';
import MediaPlayer from '../tools/MediaPlayer';
import TodoList from '../tools/TodoList';
import MoodBoard from '../tools/MoodBoard';
import UnitConverter from '../tools/UnitConverter';
import ColorPicker from '../tools/ColorPicker';
import QRGenerator from '../tools/QRGenerator';
import NovelGenerator from '../tools/NovelGenerator';
import NotFound from '../NotFound';

const ToolRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Tools />} />
      <Route path="media-player" element={<MediaPlayer />} />
      <Route path="todo-list" element={<TodoList />} />
      <Route path="mood-board" element={<MoodBoard />} />
      <Route path="unit-converter" element={<UnitConverter />} />
      <Route path="color-picker" element={<ColorPicker />} />
      <Route path="qr-generator" element={<QRGenerator />} />
      <Route path="novel-generator" element={<NovelGenerator />} />
      <Route path="/" element={<Navigate to="./" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ToolRoutes;
