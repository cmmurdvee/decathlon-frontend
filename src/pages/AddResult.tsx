import { useEffect, useState } from "react";
import type { Athlete } from "../models/Athlete";

const disciplines = [
    "100m",
    "400m",
    "1500m",
    "110m tõkked",
    "kaugushüpe",
    "kõrgushüpe",
    "teivashüpe",
    "kuulitõuge",
    "kettaheit",
    "odavise"
];

function AddResult() {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [athleteId, setAthleteId] = useState<number>(0);
    const [discipline, setDiscipline] = useState<string>(disciplines[0]);
    const [performance, setPerformance] = useState<number>(0);

    useEffect(() => {
        fetch(import.meta.env.VITE_BACK_URL + "/athletes?page=0&size=1000")
            .then(res => res.json())
            .then(json => {
                if (json.message && json.timestamp && json.status) {
                    alert("Juhtus viga: " + json.message);
                    return;
                }
                setAthletes(json.content);
                if (json.content.length > 0) {
                    setAthleteId(json.content[0].id);
                }
            });
    }, []);

    const addResult = () => {
        if (athleteId === 0) {
            alert("Vali sportlane");
            return;
        }
        const newResult = {
            discipline: discipline,
            performance: performance
        };
        fetch(import.meta.env.VITE_BACK_URL + "/athletes/" + athleteId + "/results", {
            method: "POST",
            body: JSON.stringify(newResult),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(json => {
                if (json.message && json.timestamp && json.status) {
                    alert("Juhtus viga: " + json.message);
                    return;
                }
                alert("Tulemus lisatud! Sportlase kogusumma: " + json.totalPoints + " punkti");
                setPerformance(0);
            });
    };

    return (
        <div>
            <h1>Lisa tulemus</h1>

            <label>Sportlane: </label>
            <select
                value={athleteId}
                onChange={(e) => setAthleteId(Number(e.target.value))}
            >
                {athletes.map(a => (
                    <option key={a.id} value={a.id}>
                        {a.firstName} {a.lastName} ({a.country})
                    </option>
                ))}
            </select>

            <br /><br />

            <label>Ala: </label>
            <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
            >
                {disciplines.map(d => (
                    <option key={d} value={d}>{d}</option>
                ))}
            </select>

            <br /><br />

            <label>Tulemus: </label>
            <input
                type="number"
                step="0.01"
                value={performance}
                onChange={(e) => setPerformance(Number(e.target.value))}
            />
            <span> (jooksud sekundid, hüpped/heited meetrid)</span>

            <br /><br />

            <button onClick={addResult}>Lisa tulemus</button>
        </div>
    );
}

export default AddResult;
