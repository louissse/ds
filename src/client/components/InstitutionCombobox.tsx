// Uses the same Base UI primitives as shadcn/ui's Base combobox,
// with local styling to preserve this project's visual direction.
import { useRef } from "react";
import { Combobox } from "@base-ui/react/combobox";
import type { InstitutionOption } from "../hooks/useInstitutions";

type InstitutionComboboxProps = {
  institutions: InstitutionOption[];
  value: string;
  onChange: (id: string) => void;
  disabled: boolean;
  placeholder: string;
};

export function InstitutionCombobox({
  institutions,
  value,
  onChange,
  disabled,
  placeholder,
}: InstitutionComboboxProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const options = institutions.map((institution) => ({
    ...institution,
    id: institution.id.split("/").pop()!,
  }));
  // Preserve a selected ID even if a changed title query omits it from the top 100.
  if (value && !options.some((item) => item.id === value)) {
    options.unshift({
      id: value,
      name: `Selected institution (${value})`,
      count: 0,
    });
  }
  const selected = options.find((item) => item.id === value) ?? null;

  return (
    <Combobox.Root
      items={options}
      value={selected}
      onValueChange={(item) => onChange(item?.id ?? "")}
      itemToStringLabel={(item) => item.name}
      isItemEqualToValue={(item, current) => item.id === current.id}
      disabled={disabled}
    >
      <div
        ref={anchorRef}
        className="flex w-full items-center rounded-sm border border-[#b5cccf] bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#0074c6]"
      >
        <Combobox.Input
          id="institution-filter"
          aria-describedby="institution-help"
          placeholder={placeholder}
          className="min-w-0 flex-1 px-3 py-2 text-base font-normal text-[#002e2e] outline-none placeholder:text-[#52675d]"
        />
        <Combobox.Trigger
          type="button"
          aria-label="Show institutions"
          className="px-3 py-2 text-[#0074c6]"
        >
          <span aria-hidden="true">▾</span>
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner
          anchor={anchorRef}
          sideOffset={4}
          align="start"
          className="z-50 max-w-[calc(100vw-2rem)]"
        >
          <Combobox.Popup className="w-[var(--anchor-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-sm border border-[#b5cccf] bg-white text-[#002e2e] shadow-md">
            <Combobox.Empty className="p-3 text-sm empty:hidden">
              No matching institutions.
            </Combobox.Empty>
            <Combobox.List className="max-h-64 overflow-y-auto overscroll-contain p-1">
              {(item: InstitutionOption) => (
                <Combobox.Item
                  key={item.id}
                  value={item}
                  className="flex cursor-pointer select-none items-start gap-2 rounded-sm px-3 py-2 text-sm font-normal data-[highlighted]:bg-[#F4F7FC] data-[highlighted]:text-[#0074c6]"
                >
                  <span className="min-w-0 flex-1 break-words">
                    {item.name} ({item.count})
                  </span>
                  <Combobox.ItemIndicator aria-hidden="true">
                    ✓
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
