import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Zap, Type, Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { AccessibilityMenu } from "./AccessibilityMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccessibilityControls() {
  const { language } = useLanguage();
  const [accessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Accessibility dropdown */}
      <DropdownMenu open={accessibilityMenuOpen} onOpenChange={setAccessibilityMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={language === 'ar' ? "خيارات إمكانية الوصول" : "Accessibility options"}
          >
            <Zap className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <AccessibilityMenu closeMenu={() => setAccessibilityMenuOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text size button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => {
          document.body.classList.toggle("large-text");
        }}
        aria-label={language === 'ar' ? "تبديل حجم النص" : "Toggle text size"}
      >
        <Type className="h-5 w-5" />
      </Button>

      {/* Language switcher */}
      <DropdownMenu open={languageMenuOpen} onOpenChange={setLanguageMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={language === 'ar' ? "تغيير اللغة" : "Change language"}
          >
            <Languages className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <LanguageSwitcher closeMenu={() => setLanguageMenuOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toggle color scheme */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => {
          document.body.classList.toggle("high-contrast");
        }}
        aria-label={language === 'ar' ? "تبديل نظام الألوان" : "Toggle color scheme"}
      >
        {document.body.classList.contains("high-contrast") ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}