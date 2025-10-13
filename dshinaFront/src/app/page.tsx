import { Suspense } from "react";
import { HeaderLayout } from "../../fsd/widgets/HeaderLayout";
import { TyreSearchForm } from "../../fsd/features";

export default function Home() {
  return (
    <div>
      <HeaderLayout />
      <div className="p-10">
        <Suspense fallback={<div>Загрузка...</div>}>
          <TyreSearchForm />
        </Suspense>
      </div>
    </div>
  );
}
