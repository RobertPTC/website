import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
};

export default function Totaler() {
  const [users, setUsers] = useState<User[]>([]);
  const [inputMap, setInputMap] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const json = await res.json();
      setUsers(json);
    }
    fetchUsers();
  }, []);
  useEffect(() => {
    const t = Object.values(inputMap).reduce((p, amt) => {
      return p + amt;
    }, 0);
    setTotal(t / 100);
  }, [inputMap]);
  return (
    <>
      {users.map((user) => (
        <div key={user.id}>
          <label>{user.name}</label>
          <input
            type="number"
            id="user"
            onChange={(e) => {
              setInputMap((inputMap) => {
                return {
                  ...inputMap,
                  [user.id]: Number(e.target.value) * 100,
                };
              });
            }}
          />
        </div>
      ))}
      <div>Total: ${total.toFixed(2)}</div>
    </>
  );
}
