import { useEffect, useState } from "react";
import type { Athlete } from "../models/Athlete";

function Athletes() {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const size = 5;

    const [country, setCountry] = useState<string>("");
    const [countries, setCountries] = useState<string[]>([]);

    const [sortDir, setSortDir] = useState<string>("desc");

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [newCountry, setNewCountry] = useState<string>("");

    const loadAthletes = () => {
        let url = import.meta.env.VITE_BACK_URL
            + "/athletes?page=" + page
            + "&size=" + size
            + "&sort=totalPoints," + sortDir;
        if (country !== "") {
            url += "&country=" + encodeURIComponent(country);
        }
        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json.message && json.timestamp && json.status) {
                    alert("Juhtus viga: " + json.message);
                    return;
                }
                setAthletes(json.content);
                setTotalPages(json.totalPages);
            });
    };

    const loadCountries = () => {
        fetch(import.meta.env.VITE_BACK_URL + "/athletes/countries")
            .then(res => res.json())
            .then(json => {
                if (json.message && json.timestamp && json.status) return;
                setCountries(json);
            });
    };

    useEffect(() => {
        loadAthletes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, country, sortDir]);

    useEffect(() => {
        loadCountries();
    }, []);

    const addAthlete = () => {
        const newAthlete = {
            firstName: firstName,
            lastName: lastName,
            country: newCountry
        };
        fetch(import.meta.env.VITE_BACK_URL + "/athletes", {
            method: "POST",
            body: JSON.stringify(newAthlete),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(json => {
                if (json.message && json.timestamp && json.status) {
                    alert("Juhtus viga: " + json.message);
                    return;
                }
                setFirstName("");
                setLastName("");
                setNewCountry("");
                setPage(0);
                loadAthletes();
                loadCountries();
            });
    };

    const deleteAthlete = (id: number) => {
        fetch(import.meta.env.VITE_BACK_URL + "/athletes/" + id, {
            method: "DELETE"
        })
            .then(() => {
                loadAthletes();
                loadCountries();
            });
    };

    return (
        <div>
            <h1>Sportlased</h1>

            <h3>Lisa sportlane</h3>
            <input
                placeholder="Eesnimi"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                placeholder="Perekonnanimi"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                placeholder="Riik"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
            />
            <button onClick={addAthlete}>Lisa</button>

            <h3>Filtreeri ja sorteeri</h3>
            <label>Riik: </label>
            <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); setPage(0); }}
            >
                <option value="">Kõik</option>
                {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            <label> Sorteeri tulemuse järgi: </label>
            <select
                value={sortDir}
                onChange={(e) => { setSortDir(e.target.value); setPage(0); }}
            >
                <option value="desc">Suurim eespool</option>
                <option value="asc">Väikseim eespool</option>
            </select>

            <table>
                <thead>
                    <tr>
                        <th>Nr</th>
                        <th>Eesnimi</th>
                        <th>Perekonnanimi</th>
                        <th>Riik</th>
                        <th>Punktid</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {athletes.map((athlete, index) => (
                        <tr key={athlete.id}>
                            <td>{page * size + index + 1}</td>
                            <td>{athlete.firstName}</td>
                            <td>{athlete.lastName}</td>
                            <td>{athlete.country}</td>
                            <td>{athlete.totalPoints}</td>
                            <td>
                                <button onClick={() => deleteAthlete(athlete.id)}>Kustuta</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {athletes.length === 0 && <p>Sportlasi ei leitud.</p>}

            {totalPages > 1 && (
                <div>
                    <button disabled={page === 0} onClick={() => setPage(page - 1)}>Eelmine</button>
                    <span> Lehekülg {page + 1} / {totalPages} </span>
                    <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Järgmine</button>
                </div>
            )}
        </div>
    );
}

export default Athletes;
