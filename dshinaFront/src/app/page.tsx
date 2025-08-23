import { GetProductListForm } from "../../fsd/features/GetByFilterProductList/GetProductListForm";
import { Header } from "../../fsd/features/Header";

export default function Home() {
  return (
    <div className="p-10">
      <Header />
      <GetProductListForm />
    </div>
  );
}
