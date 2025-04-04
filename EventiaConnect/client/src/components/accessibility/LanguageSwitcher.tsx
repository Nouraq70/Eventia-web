import { useLanguage } from "@/hooks/use-language";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { Language } from "@/lib/types";

interface LanguageSwitcherProps {
  closeMenu: () => void;
}

export function LanguageSwitcher({ closeMenu }: LanguageSwitcherProps) {
  const { language, setLanguage, getSupportedLanguages, isRtl } = useLanguage();
  const supportedLanguages = getSupportedLanguages();

  return (
    <div className="p-2 max-h-[400px] overflow-y-auto">
      {supportedLanguages.map((lang) => (
        <LanguageOption 
          key={lang.code}
          lang={lang}
          currentLanguage={language}
          onSelect={() => {
            setLanguage(lang.code as Language);
            closeMenu();
          }}
        />
      ))}
    </div>
  );
}

interface LanguageOptionProps {
  lang: {
    code: string;
    name: string;
    englishName: string;
    flag: string;
  };
  currentLanguage: Language;
  onSelect: () => void;
}

function LanguageOption({ lang, currentLanguage, onSelect }: LanguageOptionProps) {
  const isSelected = currentLanguage === lang.code;
  
  return (
    <DropdownMenuItem
      className="flex items-center justify-between cursor-pointer"
      onClick={onSelect}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{lang.flag}</span>
        <span className="flex flex-col">
          <span className="font-medium">{lang.name}</span>
          <span className="text-xs text-neutral-500">{lang.englishName}</span>
        </span>
      </div>
      
      {isSelected && (
        <Check className="h-4 w-4 text-primary" />
      )}
    </DropdownMenuItem>
  );
}