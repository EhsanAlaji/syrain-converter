import { useEffect, useState } from "react";
import x from "./assets/ssss.jpeg";

/* =======================
   Types
======================= */
type Lang = "ar" | "en";

type Translation = {
  title: string;
  old: string;
  new: string;
  rule: string;
  mixed: string;
  total: string;
  payOld: string;
  calc: string;
  result: string;
  dark: string;
  light: string;
  lang: string;
};

/* =======================
   Constants
======================= */
const RATE = 100;

const translations: Record<Lang, Translation> = {
  ar: {
    title: "محول الليرة السورية",
    old: "الليرة القديمة",
    new: "الليرة الجديدة",
    rule: "كل 100 ليرة قديمة = 1 ليرة جديدة",
    mixed: "الدفع بعملتين معاً",
    total: "المبلغ المطلوب (ليرة جديدة)",
    payOld: "سيدفع بالليرة القديمة",
    calc: "احسب المتبقي",
    result: "يدفع",
    dark: "الوضع الليلي",
    light: "الوضع النهاري",
    lang: "English",
  },
  en: {
    title: "Syrian Pound Converter",
    old: "Old SYP",
    new: "New SYP",
    rule: "100 old SYP = 1 new SYP",
    mixed: "Mixed Payment",
    total: "Total amount (New SYP)",
    payOld: "Paying with Old SYP",
    calc: "Calculate",
    result: "Pay",
    dark: "Dark Mode",
    light: "Light Mode",
    lang: "العربية",
  },
};

/* =======================
   Helpers
======================= */
function getSettings(): { lang: Lang; dark: boolean } {
  try {
    const saved = localStorage.getItem("sy-settings");
    if (!saved) {
      return { lang: "ar", dark: false };
    }
    const parsed = JSON.parse(saved);
    return {
      lang: parsed.lang === "en" ? "en" : "ar",
      dark: Boolean(parsed.dark),
    };
  } catch {
    return { lang: "ar", dark: false };
  }
}

/* =======================
   App
======================= */
export default function App() {
  const [oldAmount, setOldAmount] = useState<string>("");
  const [newAmount, setNewAmount] = useState<string>("");

  const [payTotalNew, setPayTotalNew] = useState<string>("");
  const [payOld, setPayOld] = useState<string>("");
  const [payNew, setPayNew] = useState<string>("");

  const [lang, setLang] = useState<Lang>("ar");
  const [dark, setDark] = useState<boolean>(false);

  /* Load settings */
  useEffect(() => {
    const settings = getSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(settings.lang);
    setDark(settings.dark);
  }, []);

  /* Save settings */
  useEffect(() => {
    localStorage.setItem(
      "sy-settings",
      JSON.stringify({ lang, dark })
    );
  }, [lang, dark]);

  const t = translations[lang];

  /* =======================
     Functions
  ======================= */
  const convertOldToNew = (value: string) => {
    setOldAmount(value);
    if (!value) {
      setNewAmount("");
      return;
    }
    setNewAmount((Number(value) / RATE).toFixed(2));
  };

  const convertNewToOld = (value: string) => {
    setNewAmount(value);
    if (!value) {
      setOldAmount("");
      return;
    }
    setOldAmount(String(Number(value) * RATE));
  };

  const calculateMixPay = () => {
    const total = Number(payTotalNew);
    const oldPaid = Number(payOld);

    if (!total) return;

    const remaining = total - oldPaid / RATE;
    setPayNew(remaining > 0 ? remaining.toFixed(2) : "0");
  };

  /* =======================
     UI
  ======================= */
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition ${
        dark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-lg p-6 space-y-8 ${
          dark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            >
              {t.lang}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-1 rounded bg-gray-600 text-white text-sm"
            >
              {dark ? t.light : t.dark}
            </button>
          </div>
        </div>

        {/* Converter */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">{t.old}</label>
            <input
              type="number"
              value={oldAmount}
              onChange={(e) => convertOldToNew(e.target.value)}
              className="w-full rounded-lg border p-2 text-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">{t.new}</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => convertNewToOld(e.target.value)}
              className="w-full rounded-lg border p-2 text-black"
            />
          </div>
        </div>

        <p className="text-center text-sm opacity-80">{t.rule}</p>

        {/* Mixed Payment */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold">{t.mixed}</h2>

          <input
            type="number"
            value={payTotalNew}
            onChange={(e) => setPayTotalNew(e.target.value)}
            placeholder={t.total}
            className="w-full rounded-lg border p-2 text-black"
          />

          <input
            type="number"
            value={payOld}
            onChange={(e) => setPayOld(e.target.value)}
            placeholder={t.payOld}
            className="w-full rounded-lg border p-2 text-black"
          />

          <button
            onClick={calculateMixPay}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {t.calc}
          </button>

          {payNew !== "" && (
            <div className="text-center font-semibold">
              <p>{t.result}:</p>
              <p>{payOld} {t.old}</p>
              <p>{payNew} {t.new}</p>
            </div>
          )}

           <img src={x} className="w-full h-auto" alt="" />
        </div>
      </div>
     
    </div>
  );
}
