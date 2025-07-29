import { useEffect, useState } from "react";
import "./App.css";
import Drafted from "./components/Drafted";
import rankings from "./data/rankings.json";
import playerInfo from "./data/playerInfo.json";

function App() {
  let main = rankings.map((player) => {
    let name = player["PLAYER NAME"];
    let age = 0;
    for (const info of playerInfo) {
      if (
        info["player"].replace(/ /g, "").toLowerCase() ===
        name.replace(/ /g, "").toLowerCase()
      ) {
        age = Number(info["age"]);
        break;
      }
    }
    return {
      tier: Number(player["TIERS"]),
      name: player["PLAYER NAME"],
      team: player["TEAM"],
      pos: player["POS"].slice(0, 2),
      age: age,
      bye: Number(player["BYE WEEK"]),
    };
  });

  const [players, setPlayers] = useState(main);
  const [borisChen, setBorisChen] = useState(false);
  const [under28, setUnder28] = useState(false);

  useEffect(() => {
    if (borisChen) {
      fetch("https://jayzheng-ff-api.herokuapp.com/rankings?format=half_ppr")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Bad response");
          }
          return res.json();
        })
        .then((response) => {
          const rankings = response["rankings"];
          rankings.map((player) => {
            let age = 0;
            for (let info of playerInfo) {
              if (
                info["player"].replace(/ /g, "").toLowerCase() ===
                player["name"].replace(/ /g, "").toLowerCase()
              ) {
                age = Number(info["age"]);
                break;
              }
            }
            return {
              ...rankings,
              age,
            };
          });
          setPlayers(rankings);
        })
        .catch((err) => console.log(err));
    }
  }, [borisChen]);

  useEffect(() => {
    if (under28) {
      const filtered = main.filter((player) => player.age < 28)
      setPlayers(filtered)
    }
    else {
      setPlayers(main)
    }
  }, [under28]);

  return (
    <>
      <nav className="flex">
        <div className="m-4">
          <input
            type="checkbox"
            checked={under28}
            onChange={(e) => setUnder28(e.target.checked)}
            name="under28"
            id=""
          />
          <label className="ml-2">Under 28</label>
        </div>
        <div className="m-4">
          <input
            type="checkbox"
            checked={borisChen}
            onChange={(e) => setBorisChen(e.target.checked)}
            name="borisChen"
            id=""
          />
          <label className="ml-2">Boris Chen Tiers</label>
        </div>
      </nav>
      <main className="flex justify-between">
        <section className="w-1/3">
          <Drafted />
        </section>
        <section className="w-2/3 grid grid-cols-2 grid-rows-2 gap-4">
          <table></table>
        </section>
      </main>
    </>
  );
}

export default App;
