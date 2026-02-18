import "./App.css";
import { Loading } from "./components/Loading/Loading";
import { useFamilyTree } from "./features/familyTree/hooks/useFamilyTree";
import { FamilyTreeView } from "./features/familyTree/components/FamilyTreeView/FamilyTreeView";

export default function App() {
  const { family, error } = useFamilyTree("/family.json");

  if (error) return <div className="app-error">Error: {error}</div>;
  if (!family) return <Loading />;

  return (
    <div className="app-container">
      <FamilyTreeView family={family} />
    </div>
  );
}
