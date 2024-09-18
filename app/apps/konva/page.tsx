import dynamic from "next/dynamic";

// https://github.com/konvajs/react-konva/issues/588
const Konva = dynamic(() => import("../../../components/konva"), {
  ssr: false,
});

export default function KonvaPage() {
  return <Konva />;
}