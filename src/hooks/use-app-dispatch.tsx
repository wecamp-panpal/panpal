import type { AppDispatch } from "@/stores/store";
import { useDispatch } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;