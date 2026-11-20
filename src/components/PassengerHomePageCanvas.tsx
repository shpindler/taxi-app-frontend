import React from 'react';
import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapListener,
  reactify,
} from '../lib/ymaps';
import styles from './PassengerHomePageCanvas.module.css';

interface Props {
  location: { center: [number, number]; zoom: number };
  pickupPoint: [number, number] | null;
  destinationPoint: [number, number] | null;
  onClick: (object: any, event: any) => void;
}

export function PassengerHomePageCanvas({
  location,
  pickupPoint,
  destinationPoint,
  onClick,
}: Props) {
  return (
    <YMap location={reactify.useDefault(location)}>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />

      <YMapListener onClick={onClick} />

      {pickupPoint && (
        <YMapMarker coordinates={pickupPoint}>
          <div className={`${styles.marker} ${styles.pickup}`} />
        </YMapMarker>
      )}

      {destinationPoint && (
        <YMapMarker coordinates={destinationPoint}>
          <div className={`${styles.marker} ${styles.destination}`} />
        </YMapMarker>
      )}
    </YMap>
  );
}