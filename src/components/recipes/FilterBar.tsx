import { Stack, Chip, Box, Button } from "@mui/material";
import type { UIRecipeCategory } from "@/types/ui-recipe";

type ChipType = UIRecipeCategory;
const CHIPS: ChipType[] = ["Dessert", "Drink", "Main Dish"];

export type FilterState = Set<ChipType>;

export default function FilterBar({
  selected,
  onToggle,
  onClear,
}: {
  selected: FilterState;
  onToggle: (c: ChipType) => void;
  onClear: () => void;
}) {
  const hasFilter = selected.size > 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <Box component="h2" sx={{ m: 0, fontFamily: '"Playfair Display", serif' }}>
          Filter
        </Box>
        {hasFilter && (
          <Button variant="text" size="small" onClick={onClear} sx={{ textTransform: "none" }}>
            Clear all
          </Button>
        )}
      </Stack>

      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.2}>
        {CHIPS.map((c) => {
          const active = selected.has(c);
          return (
            <Chip
              key={c}
              label={c}
              color={active ? "primary" : "default"}
              variant={active ? "filled" : "outlined"}
              onClick={() => onToggle(c)}
              sx={{ borderRadius: 9999 }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}