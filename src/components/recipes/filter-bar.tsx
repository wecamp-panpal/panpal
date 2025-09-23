import { Stack, Chip, Box } from "@mui/material";
import type { UIRecipeCategory } from "@/types/ui-recipe";

const CHIPS: UIRecipeCategory[] = ["APPETIZER", "DESSERT", "MAIN_DISH", "SIDE_DISH", "SOUP", "SAUCE", "DRINK", "SALAD"];

export type FilterState = UIRecipeCategory | null;

export default function FilterBar({
  selected,
  onToggle,
}: {
  selected: FilterState;
  onToggle: (c: UIRecipeCategory) => void;
}) {

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <Box component="h2" sx={{ m: 0, fontFamily: '"Playfair Display", serif' }}>
          Filter
        </Box>
      </Stack>

      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.2}>
        {CHIPS.map((c) => {
          const active = selected === c;
          return (
            <Chip
              key={c}
              label={c.replace("_", " ").toLowerCase().replace(/^\w/, l => l.toUpperCase())}
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