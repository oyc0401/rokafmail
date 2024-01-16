import { Find } from "./find";
import { List } from "./list";
import { User } from "src/db";

async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  console.log(searchParams);

  const generation = Number(searchParams.generation);
  const name = searchParams.name;
  const birth = searchParams.birth;

  if (generation == null || name == null || birth == null) {
    return <Find></Find>;
  }

  const users = await User.findByInfo({ generation, name, birth });

  return <List users={users}></List>;
}

export default Search;
