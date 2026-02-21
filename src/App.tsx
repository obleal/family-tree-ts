import "./App.css";
import { Loading } from "./components/Loading/Loading";
import { useData } from "./features/familyTree/hooks/useFamilyTree";
import { FamilyTreeView } from "./features/familyTree/components/FamilyTreeView/FamilyTreeView";

export default function App() {
  const { data, error } = useData("/family.json");

  if (error) return <div className="app-error">Error: {error}</div>;
  if (!data) return <Loading />;

  return (
    <div className="app-container">
      <FamilyTreeView family={data} />
    </div>
  );
}
