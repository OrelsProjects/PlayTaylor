import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { PanInfo } from "framer-motion";

interface SnapPoint {
  x: number;
}

interface InteractableProps {
  children?: React.ReactNode;
  snapPoints: SnapPoint[];
  onSnap: (x: number) => void;
  onSwipe?: (response: boolean) => void;
  initialX?: number; // Optionally specify an initial x position
  style?: React.CSSProperties;
}

function calculateSnapPoint(x: number, snapPoints: number[]): number {
  const snapPointsNoZero = snapPoints.filter(p => p !== 0);
  const distances = snapPointsNoZero.map(p => Math.abs(x - p));
  const minDistance = Math.min(...distances);
  const index = distances.indexOf(minDistance);
  return snapPointsNoZero[index];
}

const Interactable: React.FC<InteractableProps> = ({
  snapPoints,
  children,
  onSnap,
  onSwipe,
  initialX = 0, // Default to 0 if not provided
  style,
}) => {
  const controls = useAnimation();
  const interactableRef = useRef<HTMLDivElement>(null);
  const [initialPosition, setInitialPosition] = useState(initialX);
  const [referencePoint, setReferencePoint] = useState(initialX);

  useEffect(() => {
    if (interactableRef.current) {
      setReferencePoint(interactableRef.current.getBoundingClientRect().left);
      console.log("referencePoint", referencePoint);
    }
  }, [interactableRef.current]);

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const x =
      interactableRef.current?.getBoundingClientRect().left ||
      0 - referencePoint;
    console.log(x);
    let nearestSnapPoint = 0;
    if (
      (x > 0 && x > 40 + referencePoint) ||
      (x < 0 && x < -40 + referencePoint)
    ) {
      nearestSnapPoint = calculateSnapPoint(
        x - referencePoint,
        snapPoints.map(p => p.x),
      );
      if (nearestSnapPoint > 0) {
        onSwipe?.(true);
      } else {
        onSwipe?.(false);
      }
    }

    await controls.start({
      x: nearestSnapPoint,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
    onSnap(nearestSnapPoint);

    // Optionally reset to initial position or some other defined state
    resetPosition();
  };

  const resetPosition = () => {
    controls.start({
      x: initialPosition,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={style}
      animate={controls}
      initial={{ x: initialPosition }}
      ref={interactableRef}
    >
      {children}
    </motion.div>
  );
};

export default Interactable;
