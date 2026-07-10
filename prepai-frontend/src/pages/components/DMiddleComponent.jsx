import { useNavigate } from "react-router-dom";
import  {TrendingUp} from "lucide-react";

export const DMiddleComponent = ({ topics}) => {

    const totalSolved = topics.reduce((acc, t) => acc + t.solved, 0);
    const totalProblems = topics.reduce((acc, t) => acc + t.total, 0);
    const doneCount = topics.filter((t) => t.solved === t.total).length;
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
                <div className="font-semibold flex justify-start gap-2"> <TrendingUp color="#22c55e" size={25}/>DSA Progress</div>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    [totalSolved, "Solved", "this session"],
                    [doneCount, "Done", "topics"],
                    [`${totalProblems === 0 ? 0 : Math.round((totalSolved / totalProblems) * 100)}%`, "Progress", "overall"],
                ].map(([val, label, sub]) => (
                    <div key={label} className="bg-gray-800 rounded-lg p-2">
                        <div className="font-bold text-sm text-green-400">{val}</div>
                        <div className="text-xs text-gray-400">{label}</div>
                        <div className="text-xs text-gray-500">{sub}</div>
                    </div>
                ))}
            </div>
            <div className="text-sm font-medium mb-2">Topic Progress</div>
            {topics.slice(0, 5).map(({ id, name, solved, total }) => (
                <div key={id} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{name}</span>
                        <span className="text-gray-400">{solved}/{total}</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-1.5">
                        <div
                            className="bg-green-400 h-1.5 rounded-full"
                            style={{ width: `${total === 0 ? 0 : (solved / total) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={() => navigate("/dsa-practice")}
                className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition"
            >
                View All Topics →
            </button>
        </div>);
};
