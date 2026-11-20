// lib/ymaps.ts
import React from 'react';
import ReactDom from 'react-dom';

// Загружаем модуль reactify и ждем готовности API
const [ymaps3React] = await Promise.all([
  ymaps3.import('@yandex/ymaps3-reactify'),
  ymaps3.ready
]);

export const reactify = ymaps3React.reactify.bindTo(React, ReactDom);

// Экспортируем нужные компоненты
export const {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapListener,
} = reactify.module(ymaps3);