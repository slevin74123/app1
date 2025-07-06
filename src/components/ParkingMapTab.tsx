"use client";

import * as React from "react";

import ParkingMap from "./ParkingMap";

interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}

export interface ParkingMapTabProps {
  user?: User;
}

export default function ParkingMapTab({
}: ParkingMapTabProps) {
  return (
    <div className="h-full w-full">
      <ParkingMap />
    </div>
  );
}