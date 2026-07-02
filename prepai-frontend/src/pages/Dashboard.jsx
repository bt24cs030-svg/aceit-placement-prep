
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { DRightComponent } from "./components/DRightComponent";
import { DMiddleComponent } from "./components/DMiddleComponent";
import { DStartComponent } from "./components/DStartComponent";

export default function Dashboard({ user, topics }) {

  const totalSolved = topics.reduce((acc, t) => acc + t.solved, 0);
  const successRate = topics.reduce((acc, t) => acc + t.total, 0) === 0 ? 0
    : Math.round((totalSolved / topics.reduce((acc, t) => acc + t.total, 0)) * 100);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex gap-2 items-center">Welcome back, {user} <Sparkles className="text-amber-500 fill-amber-400" /></h1>
        <p className="text-gray-400 text-sm">You're making great progress! Keep up the momentum.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          <DStartComponent solved={totalSolved}  success={successRate} />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <DMiddleComponent topics={topics} />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <DRightComponent topics={topics} />
        </div>
      </div>
    </div>
  );
}