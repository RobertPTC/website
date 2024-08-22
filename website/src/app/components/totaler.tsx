import { useEffect, useRef, useState } from "react";

type User = {
  id: number;
  name: string;
};

export default function Totaler() {
  const [users, setUsers] = useState<User[]>([]);
  const amountMap = useRef<{ [key: string]: number }>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const json = await res.json();
      setUsers(json);
    }
    fetchUsers();
  }, []);

  return (
    <>
      {users.map((user) => (
        <div key={user.id}>
          <label>{user.name}</label>
          <input
            type="number"
            id="user"
            onChange={(e) => {
              amountMap.current[user.id] = Number(e.target.value) * 100;
              const t = Object.values(amountMap.current).reduce(
                (p, curr) => p + curr,
                0
              );
              setTotal(t / 100);
            }}
          />
        </div>
      ))}
      <div>Total: ${total.toFixed(2)}</div>
    </>
  );
}
