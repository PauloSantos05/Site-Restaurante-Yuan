/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

export default function Decorations() {
  return (
    <>
      {/* Decorative background bamboo/plant illustration left */}
      <motion.div
        className="bg-decor bg-decor--left hidden md:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.18, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Decorative background bamboo/plant illustration right */}
      <motion.div
        className="bg-decor bg-decor--right hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.18, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Small floating gold clouds / ornaments for extra Chinese Imperial vibe */}
      <div className="absolute top-8 left-8 text-[#C8A84B] opacity-25 pointer-events-none hidden lg:block select-none font-display text-4xl">
        🏮
      </div>
      <div className="absolute top-8 right-8 text-[#C8A84B] opacity-25 pointer-events-none hidden lg:block select-none font-display text-4xl">
        🏮
      </div>
    </>
  );
}
