/**
 * /test/khmer — Khmer clipping visual-diff harness (Phase 3 Plan 3-16).
 *
 * Renders ALL 14 primitives (buttons, input, textarea, select, checkbox,
 * radio, switch, label, form, badge, tooltip, tabs, separator, scroll-area)
 * under a single `<div lang="km">` so the `:lang(km)` cascade in
 * registry/dgc-theme/globals.css drives `--font-khmer` + `--leading-loose`
 * (1.6) on every descendant automatically (UI-SPEC §3, D-07).
 *
 * NO per-component lang branching (D-07). NO per-component line-height
 * overrides. Every string includes authentic government-tone Khmer with
 * coeng subscripts (្ក ្ខ ្គ ្ឃ) to stress-test descender accommodation
 * on Tooltip / Badge / Tabs / Button / Input at their fixed heights.
 *
 * Playwright visual-diff spec (Task 2 of plan 3-16) screenshots this page
 * and asserts no regression — CI fails on drift (D-17).
 */
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../../../../registry/button/button';
import { Input } from '../../../../registry/input/input';
import { Textarea } from '../../../../registry/textarea/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../registry/select/select';
import { Checkbox } from '../../../../registry/checkbox/checkbox';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../registry/radio/radio';
import { Switch } from '../../../../registry/switch/switch';
import { Label } from '../../../../registry/label/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../registry/form/form';
import { Badge } from '../../../../registry/badge/badge';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../registry/tooltip/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../registry/tabs/tabs';
import { Separator } from '../../../../registry/separator/separator';
import { ScrollArea } from '../../../../registry/scroll-area/scroll-area';

/**
 * Zod schema — Khmer error "សូមបំពេញឈ្មោះ" fires when the required
 * fullName field is empty. Plan 3-16 asserts this exact string.
 */
const khmerFormSchema = z.object({
  fullName: z.string().min(1, 'សូមបំពេញឈ្មោះ'),
});

type KhmerFormValues = z.infer<typeof khmerFormSchema>;

/**
 * Province radio options — government-tone Khmer place names with
 * authentic spellings (no coeng here, but paired with subscript-heavy
 * labels elsewhere on the page).
 */
const PROVINCES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'pp', label: 'ភ្នំពេញ' },
  { value: 'sr', label: 'សៀមរាប' },
  { value: 'bb', label: 'បាត់ដំបង' },
];

/**
 * Tabs — government portal section names with coeng subscripts to
 * stress-test tab label descender accommodation (្ម, ្ត).
 */
const PORTAL_TABS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'news', label: 'ព័ត៌មាន' },
  { value: 'docs', label: 'ឯកសារ' },
  { value: 'settings', label: 'កំណត់' },
];

/**
 * ScrollArea rows — 20 Khmer ministry/agency names, several carrying
 * coeng stacks (្ក, ្រ, ្ត, ្ម, ្ស, ្ព) so the visual-diff catches any
 * line-box clipping inside a scrollable container.
 */
const MINISTRY_ROWS: ReadonlyArray<string> = [
  'ក្រសួងមហាផ្ទៃ',
  'ក្រសួងការបរទេស និងសហប្រតិបត្តិការអន្តរជាតិ',
  'ក្រសួងសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ',
  'ក្រសួងអប់រំ យុវជន និងកីឡា',
  'ក្រសួងសុខាភិបាល',
  'ក្រសួងការពារជាតិ',
  'ក្រសួងយុត្តិធម៌',
  'ក្រសួងកសិកម្ម រុក្ខាប្រមាញ់ និងនេសាទ',
  'ក្រសួងឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍',
  'ក្រសួងប្រៃសណីយ៍ និងទូរគមនាគមន៍',
  'ក្រសួងពាណិជ្ជកម្ម',
  'ក្រសួងទេសចរណ៍',
  'ក្រសួងវប្បធម៌ និងវិចិត្រសិល្បៈ',
  'ក្រសួងធនធានទឹក និងឧតុនិយម',
  'ក្រសួងបរិស្ថាន',
  'ក្រសួងរ៉ែ និងថាមពល',
  'ក្រសួងសាធារណការ និងដឹកជញ្ជូន',
  'ក្រសួងរៀបចំដែនដី នគរូបនីយកម្ម និងសំណង់',
  'ក្រសួងមុខងារសាធារណៈ',
  'អគ្គនាយកដ្ឋានឌីជីថល (អ.ឌ.ជ.)',
];

export default function KhmerClippingTestPage(): React.ReactElement {
  const form = useForm<KhmerFormValues>({
    resolver: zodResolver(khmerFormSchema),
    defaultValues: { fullName: '' },
    mode: 'onSubmit',
  });

  // Trigger validation on mount so the FormMessage "សូមបំពេញឈ្មោះ" is
  // visible to the Playwright snapshot without user interaction.
  React.useEffect(() => {
    void form.trigger();
  }, [form]);

  const [switchOn, setSwitchOn] = React.useState<boolean>(true);
  const [checkboxOn, setCheckboxOn] = React.useState<
    boolean | 'indeterminate'
  >(true);
  const [radioValue, setRadioValue] = React.useState<string>('pp');

  return (
    <div
      lang="km"
      className="font-khmer space-y-6 p-6"
      data-testid="khmer-clipping-root"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          ការសាកល្បងពុម្ពអក្សរខ្មែរ និងការកាត់ឃ្លា
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          រាល់សមាសធាតុគោល ១៤ បង្ហាញជាមួយអក្សរខ្មែរផ្លូវការ រួមជាមួយ
          coeng subscripts (្ក ្ខ ្គ ្ឃ) ដើម្បីធានាថាគ្មានការកាត់ឃ្លា។
        </p>
      </header>

      {/* 1. Button — 3 variants with coeng-bearing labels */}
      <section
        data-testid="khmer-section-button"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ប៊ូតុង</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">ចុចនៅទីនេះ</Button>
          <Button variant="secondary">សូមបញ្ជាក់</Button>
          <Button variant="ghost-danger">បោះបង់</Button>
        </div>
      </section>

      <Separator />

      {/* 2. Input — text + date; date placeholder Khmer */}
      <section
        data-testid="khmer-section-input"
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold">ប្រអប់បញ្ចូល</h2>
        <div className="flex max-w-md flex-col gap-2">
          <Label htmlFor="khmer-input-name" required>
            ឈ្មោះពេញ
          </Label>
          <Input
            id="khmer-input-name"
            type="text"
            placeholder="បញ្ចូលឈ្មោះ"
          />
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <Label htmlFor="khmer-input-date">កាលបរិច្ឆេទកំណើត</Label>
          <Input
            id="khmer-input-date"
            type="date"
            aria-placeholder="ថ្ងៃ/ខែ/ឆ្នាំ"
          />
        </div>
      </section>

      <Separator />

      {/* 3. Textarea — placeholder includes literal coeng sequences */}
      <section
        data-testid="khmer-section-textarea"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">តំបន់សរសេរអត្ថបទ</h2>
        <div className="flex max-w-md flex-col gap-2">
          <Label htmlFor="khmer-textarea">សេចក្តីពន្យល់</Label>
          <Textarea
            id="khmer-textarea"
            rows={4}
            placeholder="សរសេរសេចក្តីពន្យល់ជាមួយ ្ក ្ខ ្គ ្ឃ subscripts"
          />
        </div>
      </section>

      <Separator />

      {/* 4. Select — 3 province options */}
      <section
        data-testid="khmer-section-select"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ជ្រើសរើសទីតាំង</h2>
        <div className="flex max-w-md flex-col gap-2">
          <Label htmlFor="khmer-select">ខេត្ត/ក្រុង</Label>
          <Select>
            <SelectTrigger id="khmer-select">
              <SelectValue placeholder="ជ្រើសរើសខេត្ត/ក្រុង" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* 5. Checkbox + Label — Terms acceptance with coeng ្ក ្ខ */}
      <section
        data-testid="khmer-section-checkbox"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ប្រអប់ធីក</h2>
        <div className="flex items-center gap-2">
          <Checkbox
            id="khmer-checkbox-terms"
            checked={checkboxOn}
            onCheckedChange={setCheckboxOn}
          />
          <Label htmlFor="khmer-checkbox-terms">
            យល់ព្រមនឹងល័ក្ខខ័ណ្ឌ
          </Label>
        </div>
      </section>

      <Separator />

      {/* 6. Radio — province group */}
      <section
        data-testid="khmer-section-radio"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ជ្រើសរើសខេត្ត</h2>
        <RadioGroup
          value={radioValue}
          onValueChange={setRadioValue}
          aria-label="ខេត្ត/ក្រុង"
        >
          {PROVINCES.map((p) => {
            const itemId = `khmer-radio-${p.value}`;
            return (
              <div key={p.value} className="flex items-center gap-2">
                <RadioGroupItem
                  id={itemId}
                  value={p.value}
                  aria-label={p.label}
                />
                <Label htmlFor={itemId}>{p.label}</Label>
              </div>
            );
          })}
        </RadioGroup>
      </section>

      <Separator />

      {/* 7. Switch + Label */}
      <section
        data-testid="khmer-section-switch"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">កុងតាក់</h2>
        <div className="flex items-center gap-3">
          <Switch
            id="khmer-switch-notify"
            checked={switchOn}
            onCheckedChange={setSwitchOn}
          />
          <Label htmlFor="khmer-switch-notify">បើកការជូនដំណឹង</Label>
        </div>
      </section>

      <Separator />

      {/* 8. Label — standalone with required asterisk */}
      <section
        data-testid="khmer-section-label"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ស្លាក</h2>
        <Label htmlFor="khmer-label-demo" required>
          ឈ្មោះពេញ
        </Label>
        <input
          id="khmer-label-demo"
          type="text"
          className="peer h-[40px] w-full max-w-md rounded-[var(--radius-md)] border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-[12px] text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))] focus-visible:shadow-[var(--shadow-focus)]"
          aria-required
        />
      </section>

      <Separator />

      {/* 9. Form — RHF + Zod with Khmer error "សូមបំពេញឈ្មោះ" */}
      <section
        data-testid="khmer-section-form"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ទម្រង់បែបបទ</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => undefined)}
            className="flex max-w-md flex-col gap-4"
            aria-label="khmer-form"
            data-testid="khmer-form"
            noValidate
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ឈ្មោះពេញ</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="បញ្ចូលឈ្មោះ"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </section>

      <Separator />

      {/* 10. Badge — 4 tones */}
      <section
        data-testid="khmer-section-badge"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ស្លាកសញ្ញា</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="default">ព័ត៌មាន</Badge>
          <Badge tone="success">ជោគជ័យ</Badge>
          <Badge tone="warning">ប្រុងប្រយ័ត្ន</Badge>
          <Badge tone="danger">បញ្ហា</Badge>
        </div>
      </section>

      <Separator />

      {/* 11. Tooltip — forced open via Radix controlled `open` prop so
             the snapshot captures the dark --gray-900 chip */}
      <section
        data-testid="khmer-section-tooltip"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ពាក្យណែនាំ</h2>
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
          <div className="flex min-h-[96px] items-center justify-start">
            <Tooltip open>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="h-[40px] rounded-[var(--radius-md)] bg-[hsl(var(--brand))] px-[16px] text-sm font-medium text-[hsl(var(--brand-foreground))] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
                >
                  ព័ត៌មានបន្ថែម
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                ព័ត៌មានបន្ថែម
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>

      <Separator />

      {/* 12. Tabs — 3 portal sections with coeng-bearing labels */}
      <section
        data-testid="khmer-section-tabs"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">ផ្ទាំងមាតិកា</h2>
        <div className="w-full max-w-[480px]">
          <Tabs defaultValue="news">
            <TabsList variant="underline">
              {PORTAL_TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  variant="underline"
                  value={t.value}
                >
                  <span className="truncate">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {PORTAL_TABS.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                <p className="text-sm text-[hsl(var(--foreground))]">
                  មាតិកាសម្រាប់ «{t.label}»។
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Separator />

      {/* 13. Separator — explicit section to expose the primitive itself */}
      <section
        data-testid="khmer-section-separator"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">បន្ទាត់បំបែក</h2>
        <p className="text-sm text-[hsl(var(--foreground))]">
          ផ្នែកខាងលើ
        </p>
        <Separator />
        <p className="text-sm text-[hsl(var(--foreground))]">
          ផ្នែកខាងក្រោម
        </p>
      </section>

      <Separator />

      {/* 14. ScrollArea — 20 ministry names with coeng stacks */}
      <section
        data-testid="khmer-section-scroll-area"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold">បញ្ជីក្រសួង</h2>
        <div className="w-full max-w-md">
          <ScrollArea
            aria-label="បញ្ជីក្រសួងនៃរាជរដ្ឋាភិបាលកម្ពុជា"
            className="w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            style={{ height: '200px' }}
          >
            <ul className="flex flex-col">
              {MINISTRY_ROWS.map((row, idx) => (
                <li
                  key={idx}
                  className="border-b border-[hsl(var(--border))] px-3 py-2 text-sm text-[hsl(var(--foreground))] last:border-b-0"
                >
                  {row}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </section>
    </div>
  );
}
