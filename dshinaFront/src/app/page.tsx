import { Suspense } from "react";
import { GetProductListForm } from "../../fsd/features/GetByFilterProductList/GetProductListForm";
import { Header } from "../../fsd/features/Header";
import { TyreFilterForm } from "../../fsd/features";

export default function Home() {
  return (
    <div className="p-10">
      <Header />
      <Suspense fallback={<div>Загрузка...</div>}>
        <TyreFilterForm />
      </Suspense>
    </div>
  );
}
