import { useState, useRef, useEffect } from 'react';

const KEY =
  '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';

const C = {
  sky: '#B8D8D8',
  skyMid: '#7AACAC',
  skyDark: '#4A8A8A',
  vanilla: '#F2DDD0',
  lilac: '#CFC8D0',
  lilacDk: '#9A90A0',
  leek: '#A8A86A',
  leekDk: '#787848',
  dark: '#1E2A2A',
  mid: '#3A5050',
  soft: '#EEF4F4',
  white: '#FAFCFC',
  offwhite: '#F5F0EC',
};

const R = { sm: 10, md: 16, lg: 20, xl: 28, pill: 50 };

const STYLES = [
  { id: 'casual', label: 'Повседневный', sub: 'Casual' },
  { id: 'sport', label: 'Спортивный', sub: 'Street' },
  { id: 'business', label: 'Деловой', sub: 'Office' },
  { id: 'evening', label: 'Вечерний', sub: 'Formal' },
];
const SEASONS = [
  { id: 'spring', label: 'Весна', abbr: 'SP' },
  { id: 'summer', label: 'Лето', abbr: 'SU' },
  { id: 'autumn', label: 'Осень', abbr: 'AU' },
  { id: 'winter', label: 'Зима', abbr: 'WI' },
];
const MARKETS = [
  {
    n: 'Wildberries',
    c: '#8B1AAA',
    u: 'https://www.wildberries.ru/catalog/0/search.aspx?search=',
  },
  { n: 'Ozon', c: '#0052E0', u: 'https://www.ozon.ru/search/?text=' },
  {
    n: 'Lamoda',
    c: '#B0001A',
    u: 'https://www.lamoda.ru/catalogsearch/result/?q=',
  },
];
const TRENDS = {
  spring: {
    colors: [
      'Vanilla Cream',
      'Skylight',
      'Gray Lilac',
      'Leek Green',
      'Soft White',
    ],
    pieces: [
      'Широкие брюки high-waist',
      'Льняная рубашка оверсайз',
      'Балетки с лентами',
      'Тренч пастельных тонов',
      'Юбка-миди А-силуэт',
    ],
    fabrics: ['Лён', 'Хлопок', 'Шёлк'],
  },
  summer: {
    colors: [
      'Skylight',
      'Vanilla Cream',
      'Macchiato',
      'Leek Green',
      'Cream White',
    ],
    pieces: [
      'Льняной сет топ+брюки',
      'Платье-халат',
      'Шорты Bermuda',
      'Сандалии платформа',
    ],
    fabrics: ['Лён', 'Вискоза', 'Батист'],
  },
  autumn: {
    colors: ['Leek Green', 'Gray Lilac', 'Vanilla Cream', 'Skylight', 'Ivory'],
    pieces: [
      'Кожаный тренч',
      'Объёмный свитер',
      'Брюки карго',
      'Ботинки Chelsea',
      'Кожаная юбка-миди',
    ],
    fabrics: ['Шерсть', 'Замша', 'Кожа'],
  },
  winter: {
    colors: ['Gray Lilac', 'Skylight', 'Vanilla Cream', 'Leek Green', 'Ivory'],
    pieces: [
      'Пальто-кокон оверсайз',
      'Водолазка',
      'Кожаные брюки',
      'Ботфорты',
      'Бархатный пиджак',
    ],
    fabrics: ['Шерсть', 'Кашемир', 'Бархат'],
  },
};
const GUIDE = [
  {
    title: 'Базовый гардероб',
    body: 'Основа стильного гардероба — универсальные вещи, которые легко комбинируются между собой и остаются актуальными вне зависимости от трендов. Белая рубашка, прямые джинсы, классические брюки, структурированный пиджак, базовая футболка, тренч, лоферы, ремень из гладкой кожи и лаконичная сумка. Эти вещи создают фундамент гардероба, на который можно накладывать сезонные тренды и акцентные элементы.',
  },
  {
    title: 'Правило цвета',
    body: 'Современный стиль строится на балансе оттенков. Оптимальная формула — до трёх цветов в одном образе: нейтральная база и один выразительный акцент. В актуальной палитре сезона доминируют натуральные оттенки: mocha, cream, sand, espresso. Они легко сочетаются с глубокими акцентами — бордовым, лесным зелёным или электрическим синим.',
  },
  {
    title: 'Пропорции силуэта',
    body: 'Гармоничный образ начинается с правильных пропорций. Если верх объёмный — низ должен быть более структурным или узким. Если низ широкий — верх лучше выбрать более лаконичный. Такой баланс визуально вытягивает силуэт, делает фигуру стройнее и создаёт современный, продуманный образ.',
  },
  {
    title: 'Качество важнее количества',
    body: 'Современный гардероб строится на принципе разумного минимализма. Лучше иметь несколько вещей безупречного кроя и качественных тканей, чем десятки случайных покупок. Инвестируйте в пиджаки, верхнюю одежду, обувь и базовый трикотаж — именно эти элементы формируют дорогой и стильный образ.',
  },
];

async function gpt(messages) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + KEY,
    },
    body: JSON.stringify({ model: 'gpt-4o', max_tokens: 1500, messages }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.choices[0].message.content;
}
function toB64(file) {
  return new Promise((ok, err) => {
    const fr = new FileReader();
    fr.onload = () =>
      ok({ b64: fr.result.split(',')[1], mime: file.type || 'image/jpeg' });
    fr.onerror = err;
    fr.readAsDataURL(file);
  });
}

const SF = { fontFamily: "'Cormorant Garamond',Georgia,serif" };
const SS = { fontFamily: "'DM Sans',sans-serif" };

function Nav({ title, onBack }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0 20px',
      }}
    >
      <button
        onClick={onBack}
        style={{
          ...SS,
          background: C.soft,
          border: 'none',
          color: C.skyDark,
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 18px',
          borderRadius: R.pill,
          fontWeight: 500,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>‹</span> Назад
      </button>
      <span
        style={{
          ...SS,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '.28em',
          color: C.skyDark,
        }}
      >
        {title}
      </span>
      <span style={{ width: 80 }} />
    </div>
  );
}
function Divider() {
  return (
    <div
      style={{
        height: 1,
        background:
          'linear-gradient(90deg,transparent,' + C.skyMid + '40,transparent)',
        margin: '18px 0',
      }}
    />
  );
}
function Lbl({ t }) {
  return (
    <div
      style={{
        ...SS,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '.26em',
        color: C.skyDark,
        marginBottom: 14,
      }}
    >
      {t}
    </div>
  );
}

function PrimaryBtn({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...SS,
        width: '100%',
        border: 'none',
        padding: '19px 28px',
        fontSize: 15,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        letterSpacing: '.04em',
        fontWeight: 500,
        marginTop: 14,
        background: disabled
          ? '#ccc'
          : 'linear-gradient(135deg,' + C.skyDark + ',' + C.mid + ')',
        color: C.white,
        opacity: disabled ? 0.5 : 1,
        borderRadius: 50,
        boxShadow: disabled ? 'none' : '0 8px 24px ' + C.skyDark + '40',
      }}
    >
      <span>{label}</span>
      <span
        style={{
          fontSize: 20,
          background: C.white + '20',
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {">"}
      </span>
    </button>
  );
}
function OutlineBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...SS,
        width: '100%',
        background: 'transparent',
        border: '1.5px solid ' + C.skyMid,
        color: C.skyDark,
        padding: '15px 28px',
        fontSize: 13,
        cursor: 'pointer',
        marginTop: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 50,
        fontWeight: 400,
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 16 }}>{">"}</span>
    </button>
  );
}
function QuoteBox({ label, text }) {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg,' + C.sky + '50,' + C.vanilla + '60)',
        borderRadius: 24,
        padding: '20px 22px',
        marginBottom: 18,
        border: '1px solid ' + C.sky,
      }}
    >
      {label && (
        <div
          style={{
            ...SS,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '.26em',
            color: C.skyDark,
            marginBottom: 10,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          ...SF,
          fontSize: 16,
          color: C.mid,
          lineHeight: 1.85,
          fontStyle: 'italic',
        }}
      >
        {text}
      </div>
    </div>
  );
}
function ListRow({ mark, text, color }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        marginBottom: 11,
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          ...SS,
          fontSize: 14,
          fontWeight: 700,
          color: color || C.skyDark,
          minWidth: 22,
          paddingTop: 1,
          flexShrink: 0,
        }}
      >
        {mark}
      </span>
      <span style={{ ...SS, fontSize: 14, color: C.mid, lineHeight: 1.7 }}>
        {text}
      </span>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [imgSrc, setImgSrc] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [review, setReview] = useState(null);
  const [style, setStyle] = useState(null);
  const [season, setSeason] = useState(null);
  const [outfits, setOutfits] = useState(null);
  const [busyText, setBusyText] = useState('');
  const [err, setErr] = useState(null);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(null);
  const [mode, setMode] = useState('body');
  const [trendSea, setTrendSea] = useState('autumn');
  const [vis, setVis] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setTimeout(() => setVis(true), 100);
  }, []);
  const go = (p) => {
    setPage(p);
    setErr(null);
    setVis(false);
    setTimeout(() => setVis(true), 80);
  };
  const pick = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setImgSrc(URL.createObjectURL(f));
  };

  const analyze = async () => {
    if (!imgFile) return;
    setBusyText(
      mode === 'item'
        ? 'Определяю вещь и собираю образ...'
        : 'Стилист анализирует вашу фигуру...'
    );
    go('busy');
    try {
      const { b64, mime } = await toB64(imgFile);
      let prompt;
      if (mode === 'item') {
        prompt = `Ты премиальный персональный стилист. Пользователь загрузил фото одной вещи. Определи её и составь 3 образа вокруг неё.
Ответь ТОЛЬКО валидным JSON без markdown:
{"mode":"item","itemName":"название вещи","stylistNote":"красивый совет 2-3 предложения","outfits":[{"name":"название","mood":"настроение","description":"описание","items":[{"category":"Верх","name":"название","detail":"цвет и фасон","search":"запрос WB","why":"почему подходит"}]}]}`;
      } else {
        prompt = `Ты премиальный персональный стилист с 15-летним опытом.
Посмотри на фото фигуры и сделай стилистический разбор.
ПРАВИЛА: никогда не говори "недостатки", "проблемная зона". Говори тепло и профессионально.
Ответь ТОЛЬКО валидным JSON без markdown:
{"impression":"общее впечатление 2-3 предложения","strengths":["сторона 1","сторона 2","сторона 3","сторона 4"],"corrections":["коррекция 1","коррекция 2","коррекция 3"],"advice":"совет стилиста 3-4 предложения","wear":["фасон 1","фасон 2","фасон 3","фасон 4","фасон 5"],"avoid":["избегать 1","избегать 2","избегать 3"],"colors":"совет по цвету"}`;
      }
      const txt = await gpt([
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: 'data:' + mime + ';base64,' + b64 },
            },
            { type: 'text', text: prompt },
          ],
        },
      ]);
      const data = JSON.parse(txt.replace(/```json\n?|```\n?/g, '').trim());
      setReview(data);
      if (data.mode === 'item') {
        setOutfits(data);
        setTab(0);
        setOpen(null);
        go('outfits');
      } else go('review');
    } catch (e) {
      setErr(e.message);
      go('upload');
    }
  };

  const makeOutfits = async () => {
    if (!style || !season) return;
    setBusyText('Подбираю образы с учётом вашей фигуры...');
    go('busy');
    try {
      const t = TRENDS[season];
      const sLabel = STYLES.find((s) => s.id === style).label;
      const seaLabel = SEASONS.find((s) => s.id === season).label;
      const prompt = `Ты премиальный персональный стилист.
Данные о клиенте: ${review.impression}
Сильные стороны: ${review.strengths.join(', ')}
Рекомендуется: ${review.wear.join(', ')}
Избегать: ${review.avoid.join(', ')}
Составь 3 образа. Стиль: ${sLabel}. Сезон: ${seaLabel} 2026.
Тренды: ${t.colors.join(', ')}. Вещи: ${t.pieces.join(', ')}.
Ответь ТОЛЬКО валидным JSON без markdown:
{"outfits":[{"name":"название","mood":"настроение","description":"описание","items":[{"category":"Верх","name":"название","detail":"цвет и фасон","search":"запрос","why":"почему подходит фигуре"}]}]}`;
      const txt = await gpt([{ role: 'user', content: prompt }]);
      const data = JSON.parse(txt.replace(/```json\n?|```\n?/g, '').trim());
      setOutfits(data);
      setTab(0);
      setOpen(null);
      go('outfits');
    } catch (e) {
      setErr(e.message);
      go('picker');
    }
  };

  const BG = {
    background:
      'linear-gradient(160deg,' +
      C.soft +
      ' 0%,' +
      C.white +
      ' 40%,' +
      C.offwhite +
      ' 100%)',
    minHeight: '100vh',
  };
  const W = { maxWidth: 480, margin: '0 auto', padding: '0 24px 90px' };
  const anim = {
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(16px)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  /* BUSY */
  if (page === 'busy')
    return (
      <div
        style={{
          ...BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');*{box-sizing:border-box;margin:0;padding:0}button{cursor:pointer}::-webkit-scrollbar{width:0}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:.4;transform:scale(.95)}50%{opacity:1;transform:scale(1.05)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div
            style={{
              width: 64,
              height: 64,
              border: '2px solid ' + C.sky,
              borderTop: '2px solid ' + C.skyDark,
              borderRadius: '50%',
              animation: 'spin 1.6s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          <div
            style={{
              width: 64,
              height: 64,
              border: '1px solid ' + C.lilac,
              borderBottom: '1px solid ' + C.leek,
              borderRadius: '50%',
              animation: 'spin 2.4s linear infinite reverse',
              margin: '-76px auto 32px',
            }}
          />
          <div
            style={{
              ...SF,
              fontSize: 24,
              color: C.dark,
              marginBottom: 10,
              fontWeight: 300,
            }}
          >
            {busyText}
          </div>
          <div
            style={{
              ...SS,
              fontSize: 13,
              color: C.skyMid,
              letterSpacing: '.04em',
            }}
          >
            Подождите 15–20 секунд
          </div>
        </div>
      </div>
    );

  /* LANDING */
  if (page === 'landing')
    return (
      <div style={{ ...BG, position: 'relative', overflow: 'hidden' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');*{box-sizing:border-box;margin:0;padding:0}button{cursor:pointer}::-webkit-scrollbar{width:0}@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>

        {/* Декор */}
        <div
          style={{
            position: 'fixed',
            top: -100,
            right: -100,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle,' + C.sky + '70 0%,transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'fixed',
            bottom: -120,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background:
              'radial-gradient(circle,' + C.lilac + '60 0%,transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background:
              'radial-gradient(circle,' + C.leek + '30 0%,transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ ...W, position: 'relative', zIndex: 1 }}>
          {/* Hero */}
          <div
            style={{
              paddingTop: 80,
              paddingBottom: 32,
              animation: 'fadeUp .8s ease both',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 28,
                background: C.sky + '50',
                padding: '8px 18px',
                borderRadius: R.pill,
                border: '1px solid ' + C.sky,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: C.skyDark,
                  animation: 'pulse 2s ease infinite',
                }}
              />
              <span
                style={{
                  ...SS,
                  fontSize: 10,
                  letterSpacing: '.22em',
                  color: C.skyDark,
                  fontWeight: 600,
                }}
              >
                PERSONAL AI STYLIST
              </span>
            </div>
            <div
              style={{
                ...SF,
                fontSize: 62,
                color: C.dark,
                lineHeight: 0.95,
                fontWeight: 300,
                marginBottom: 8,
              }}
            >
              Style Code
            </div>
            <div
              style={{
                ...SS,
                fontSize: 14,
                color: C.skyMid,
                letterSpacing: '.16em',
                fontWeight: 300,
                marginBottom: 24,
              }}
            >
              by Nigai
            </div>
            <div
              style={{
                ...SS,
                fontSize: 15,
                color: C.mid,
                lineHeight: 1.85,
                fontWeight: 300,
                maxWidth: 300,
              }}
            >
              Создавай стильные образы за секунды с помощью профессиональных
              стилистов
            </div>
          </div>

          {/* Фичи — без номеров */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                t: 'Анализ фигуры',
                d: 'Персональный разбор от стилиста — сильные стороны и рекомендации',
                accent: C.sky,
                dot: C.skyDark,
              },
              {
                t: 'Индивидуальные образы',
                d: 'Трендовые образы сформированные под вашу фигуру и стиль',
                accent: C.vanilla,
                dot: '#C4906A',
              },
              {
                t: 'Образ под вещь',
                d: 'Покажи вещь — стилист соберёт вокруг неё три готовых образа',
                accent: C.lilac,
                dot: C.lilacDk,
              },
              {
                t: 'Быстрый поиск',
                d: 'Быстрый поиск вещей на маркетплейсах',
                accent: C.leek + '80',
                dot: C.leekDk,
              },
              {
                t: 'Тренды сезона',
                d: 'Актуальные луки и цвета от профессиональных стилистов',
                accent: C.sky + '60',
                dot: C.skyDark,
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '17px 0',
                  borderBottom: '1px solid ' + C.skyMid + '20',
                  animation: 'fadeUp .6s ' + (0.15 + i * 0.08) + 's ease both',
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: f.dot,
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                />
                <div>
                  <div
                    style={{
                      ...SF,
                      fontSize: 20,
                      color: C.dark,
                      marginBottom: 3,
                      fontWeight: 400,
                    }}
                  >
                    {f.t}
                  </div>
                  <div
                    style={{
                      ...SS,
                      fontSize: 13,
                      color: C.skyMid,
                      lineHeight: 1.65,
                      fontWeight: 300,
                    }}
                  >
                    {f.d}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              animation: 'fadeUp .8s .6s ease both',
              opacity: 0,
              animationFillMode: 'forwards',
              marginTop: 36,
            }}
          >
            {/* Бейдж бесплатно */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: C.sky + '40',
                  padding: '10px 22px',
                  borderRadius: R.pill,
                  border: '1px solid ' + C.sky,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: C.skyDark,
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    ...SS,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '.16em',
                    color: C.skyDark,
                  }}
                >
                  БЕСПЛАТНО
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: C.vanilla,
                  padding: '10px 22px',
                  borderRadius: R.pill,
                  border: '1px solid ' + C.vanilla,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#C4906A',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    ...SS,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '.16em',
                    color: '#A07050',
                  }}
                >
                  3 ГЕНЕРАЦИИ
                </span>
              </div>
            </div>

            {/* Главная кнопка */}
            <button
              onClick={() => go('home')}
              style={{
                ...SS,
                width: '100%',
                background:
                  'linear-gradient(135deg,' +
                  C.skyDark +
                  ' 0%,' +
                  C.mid +
                  ' 100%)',
                color: C.white,
                border: 'none',
                padding: '22px 32px',
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 50,
                boxShadow: '0 12px 40px ' + C.skyDark + '50',
                fontWeight: 400,
                letterSpacing: '.04em',
              }}
            >
              <span
                style={{
                  ...SF,
                  fontSize: 26,
                  fontWeight: 300,
                  fontStyle: 'italic',
                }}
              >
                Начать
              </span>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: C.white + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {">"}
              </div>
            </button>
          </div>
        </div>
      </div>
    );

  /* HOME */
  if (page === 'home')
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <div
            style={{
              paddingTop: 40,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  ...SF,
                  fontSize: 30,
                  color: C.dark,
                  lineHeight: 1,
                  fontWeight: 300,
                }}
              >
                Style Code
              </div>
              <div
                style={{
                  ...SS,
                  fontSize: 12,
                  color: C.skyMid,
                  letterSpacing: '.12em',
                  marginTop: 3,
                  fontWeight: 300,
                }}
              >
                by Nigai
              </div>
            </div>
            <div
              style={{
                ...SS,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '.14em',
                background: C.sky + '50',
                color: C.skyDark,
                padding: '8px 18px',
                borderRadius: R.pill,
                border: '1px solid ' + C.sky,
              }}
            >
              3 FREE
            </div>
          </div>

          <div
            style={{
              ...SS,
              fontSize: 10,
              color: C.skyDark,
              letterSpacing: '.2em',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            ПЕРСОНАЛЬНЫЙ СТИЛИСТ
          </div>
          <div
            style={{
              ...SF,
              fontSize: 40,
              color: C.dark,
              lineHeight: 1.05,
              marginBottom: 20,
              fontWeight: 300,
            }}
          >
            Создай свой
            <br />
            идеальный образ
          </div>
          <Divider />

          {/* Главная карточка */}
          <div
            onClick={() => {
              setMode('body');
              setImgSrc(null);
              setImgFile(null);
              go('upload');
            }}
            style={{
              background:
                'linear-gradient(135deg,' +
                C.skyDark +
                ' 0%,' +
                C.mid +
                ' 100%)',
              padding: '26px 24px 24px',
              marginBottom: 16,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 50,
              boxShadow: '0 12px 40px ' + C.skyDark + '40',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: C.white + '15',
                  padding: '5px 14px',
                  borderRadius: R.pill,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: C.sky,
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    ...SS,
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '.2em',
                    color: C.white,
                  }}
                >
                  ГЛАВНОЕ
                </span>
              </div>
            </div>
            <div
              style={{
                ...SF,
                fontSize: 36,
                color: C.white,
                lineHeight: 1,
                marginBottom: 10,
                fontWeight: 300,
              }}
            >
              Разбор
              <br />
              от стилиста
            </div>
            <div
              style={{
                ...SS,
                fontSize: 13,
                color: C.sky,
                lineHeight: 1.65,
                marginBottom: 20,
                fontWeight: 300,
              }}
            >
              Загрузи фото — получи персональный стилистический разбор и
              трендовые образы
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  ...SS,
                  fontSize: 12,
                  color: C.white,
                  letterSpacing: '.08em',
                  fontWeight: 400,
                }}
              >
                Начать анализ
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: C.white + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: C.white,
                }}
              >
                {">"}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: -40,
                right: -40,
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: C.white,
                opacity: 0.05,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: 60,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: C.sky,
                opacity: 0.15,
              }}
            />
          </div>

          {/* Две карточки */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              onClick={() => {
                setMode('item');
                setImgSrc(null);
                setImgFile(null);
                go('upload');
              }}
              style={{
                background:
                  'linear-gradient(135deg,' + C.sky + '80,' + C.sky + '40)',
                border: '1px solid ' + C.sky,
                padding: '20px 18px 18px',
                cursor: 'pointer',
                position: 'relative',
                minHeight: 140,
                borderRadius: 24,
                boxShadow: '0 4px 20px ' + C.sky + '30',
              }}
            >
              <div
                style={{
                  ...SF,
                  fontSize: 18,
                  color: C.dark,
                  marginBottom: 6,
                  lineHeight: 1.2,
                  fontWeight: 400,
                }}
              >
                Образ
                <br />
                под вещь
              </div>
              <div
                style={{
                  ...SS,
                  fontSize: 11,
                  color: C.mid,
                  lineHeight: 1.45,
                  fontWeight: 300,
                }}
              >
                Фото вещи — образ по трендам
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: C.skyDark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: C.white,
                }}
              >
                {">"}
              </div>
            </div>
            <div
              onClick={() => go('guide')}
              style={{
                background:
                  'linear-gradient(135deg,' + C.lilac + '90,' + C.lilac + '50)',
                border: '1px solid ' + C.lilac,
                padding: '20px 18px 18px',
                cursor: 'pointer',
                position: 'relative',
                minHeight: 140,
                borderRadius: 24,
                boxShadow: '0 4px 20px ' + C.lilac + '40',
              }}
            >
              <div
                style={{
                  ...SF,
                  fontSize: 18,
                  color: C.dark,
                  marginBottom: 6,
                  lineHeight: 1.2,
                  fontWeight: 400,
                }}
              >
                Гид по
                <br />
                стилю
              </div>
              <div
                style={{
                  ...SS,
                  fontSize: 11,
                  color: C.mid,
                  lineHeight: 1.45,
                  fontWeight: 300,
                }}
              >
                Советы стилиста для вас
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: C.lilacDk,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: C.white,
                }}
              >
                {">"}
              </div>
            </div>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            {[
              ['Тренды сезона', 'trends', C.leek + '50', C.leekDk],
              ['История', 'history', C.vanilla, C.skyDark],
            ].map(([t, p, bg, ac]) => (
              <div
                key={p}
                onClick={() => go(p)}
                style={{
                  background: bg,
                  border: '1px solid ' + C.skyMid + '20',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderRadius: 24,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: ac,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    ...SS,
                    fontSize: 13,
                    color: C.dark,
                    fontWeight: 400,
                  }}
                >
                  {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  /* UPLOAD */
  if (page === 'upload')
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav
            title={mode === 'item' ? 'ОБРАЗ ПОД ВЕЩЬ' : 'АНАЛИЗ ФИГУРЫ'}
            onBack={() => go('home')}
          />
          {err && (
            <div
              style={{
                ...SS,
                background: '#FFE8E8',
                color: '#C04040',
                padding: '13px 18px',
                fontSize: 13,
                marginBottom: 18,
                lineHeight: 1.5,
                borderRadius: 16,
                border: '1px solid #FFC0C0',
              }}
            >
              {err}
            </div>
          )}
          <div
            style={{
              ...SF,
              fontSize: 30,
              color: C.dark,
              marginBottom: 20,
              fontWeight: 300,
              lineHeight: 1.2,
            }}
          >
            {mode === 'item' ? 'Загрузи фото вещи' : 'Загрузи своё фото'}
          </div>
          {mode === 'body' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginBottom: 22,
              }}
            >
              {[
                ['Полный рост', C.sky + '70'],
                ['Светлый фон', C.vanilla],
                ['Облегающая одежда', C.lilac + '80'],
                ['Фронтальный вид', C.leek + '50'],
              ].map(([t, bg], i) => (
                <div
                  key={i}
                  style={{
                    background: bg,
                    padding: '13px 14px',
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      ...SS,
                      fontSize: 13,
                      color: C.dark,
                      fontWeight: 400,
                    }}
                  >
                    {t}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            onClick={() => ref.current.click()}
            style={{
              background: C.white,
              border: '2px dashed ' + C.skyMid + '60',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              marginBottom: 18,
              borderRadius: 50,
            }}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                style={{ width: '100%', maxHeight: 380, objectFit: 'cover' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: C.sky + '50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 28,
                    color: C.skyDark,
                  }}
                >
                  +
                </div>
                <div
                  style={{
                    ...SS,
                    fontSize: 13,
                    color: C.skyMid,
                    letterSpacing: '.08em',
                    fontWeight: 300,
                  }}
                >
                  Нажми чтобы выбрать фото
                </div>
              </div>
            )}
          </div>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={pick}
          />
          {imgSrc && <PrimaryBtn label="Анализировать" onClick={analyze} />}
          <OutlineBtn
            label={imgSrc ? 'Выбрать другое фото' : 'Открыть галерею'}
            onClick={() => ref.current.click()}
          />
        </div>
      </div>
    );

  /* REVIEW */
  if (page === 'review' && review)
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav title="СТИЛИСТИЧЕСКИЙ РАЗБОР" onBack={() => go('upload')} />
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                ...SS,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '.3em',
                color: C.skyDark,
                marginBottom: 10,
              }}
            >
              ТВОЙ STYLE REVIEW
            </div>
            <div
              style={{
                ...SF,
                fontSize: 48,
                color: C.dark,
                lineHeight: 0.95,
                fontWeight: 300,
              }}
            >
              Style
              <br />
              Review
            </div>
            <div
              style={{
                width: 52,
                height: 3,
                background:
                  'linear-gradient(90deg,' + C.skyDark + ',' + C.leek + ')',
                marginTop: 16,
                borderRadius: 2,
              }}
            />
          </div>
          <QuoteBox label="ОБЩЕЕ ВПЕЧАТЛЕНИЕ" text={review.impression} />
          <div style={{ marginBottom: 22 }}>
            <Lbl t="ЧТО В ТЕБЕ ОСОБЕННО КРАСИВО" />
            {review.strengths &&
              review.strengths.map((x, i) => (
                <ListRow key={i} mark="✦" text={x} color={C.skyDark} />
              ))}
          </div>
          <QuoteBox label="СЛОВО СТИЛИСТА" text={review.advice} />
          {review.corrections && review.corrections.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <Lbl t="ЧТО СТОИТ СКОРРЕКТИРОВАТЬ СТИЛЕМ" />
              {review.corrections.map((x, i) => (
                <ListRow key={i} mark="→" text={x} color={C.lilacDk} />
              ))}
            </div>
          )}
          <div style={{ marginBottom: 22 }}>
            <Lbl t="ЧТО ТЕБЕ ПОДОЙДЁТ" />
            {review.wear &&
              review.wear.map((x, i) => (
                <ListRow key={i} mark="+" text={x} color={C.leekDk} />
              ))}
          </div>
          <div style={{ marginBottom: 22 }}>
            <Lbl t="ЧТО ЛУЧШЕ НЕ ВЫБИРАТЬ" />
            {review.avoid &&
              review.avoid.map((x, i) => (
                <ListRow key={i} mark="−" text={x} color="#9a7070" />
              ))}
          </div>
          {review.colors && (
            <div style={{ marginBottom: 22 }}>
              <Lbl t="ЦВЕТ И СОЧЕТАНИЯ" />
              <div
                style={{
                  ...SS,
                  fontSize: 14,
                  color: C.mid,
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                {review.colors}
              </div>
            </div>
          )}
          <Divider />
          <PrimaryBtn
            label="Подобрать мои образы"
            onClick={() => go('picker')}
          />
        </div>
      </div>
    );

  /* PICKER */
  if (page === 'picker')
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav title="СТИЛЬ · СЕЗОН" onBack={() => go('review')} />
          {review && (
            <div
              style={{
                ...SF,
                fontSize: 14,
                color: C.mid,
                lineHeight: 1.75,
                padding: '18px 20px',
                background:
                  'linear-gradient(135deg,' + C.sky + '40,' + C.vanilla + '50)',
                borderRadius: 24,
                marginBottom: 26,
                fontStyle: 'italic',
                fontWeight: 300,
                border: '1px solid ' + C.sky + '60',
              }}
            >
              {review.impression.slice(0, 115)}...
            </div>
          )}
          <Lbl t="ВЫБЕРИ СТИЛЬ" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 26,
            }}
          >
            {STYLES.map((st) => (
              <div
                key={st.id}
                onClick={() => setStyle(st.id)}
                style={{
                  background:
                    style === st.id
                      ? 'linear-gradient(135deg,' +
                        C.sky +
                        ',' +
                        C.skyMid +
                        '30)'
                      : C.white,
                  border:
                    '1.5px solid ' +
                    (style === st.id ? C.skyDark : C.skyMid + '40'),
                  padding: '18px 16px',
                  cursor: 'pointer',
                  borderRadius: 24,
                  transition: 'all .2s',
                  boxShadow:
                    style === st.id ? '0 4px 20px ' + C.sky + '60' : 'none',
                }}
              >
                <div
                  style={{
                    ...SF,
                    fontSize: 20,
                    color: style === st.id ? C.dark : C.skyDark,
                    marginBottom: 4,
                    fontWeight: 400,
                  }}
                >
                  {st.label}
                </div>
                <div
                  style={{
                    ...SS,
                    fontSize: 11,
                    color: C.skyMid,
                    fontWeight: 300,
                  }}
                >
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
          <Lbl t="ВЫБЕРИ СЕЗОН" />
          <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
            {SEASONS.map((se) => (
              <div
                key={se.id}
                onClick={() => setSeason(se.id)}
                style={{
                  flex: 1,
                  padding: '14px 6px',
                  border:
                    '1.5px solid ' +
                    (season === se.id ? C.skyDark : C.skyMid + '40'),
                  background:
                    season === se.id
                      ? 'linear-gradient(135deg,' +
                        C.skyDark +
                        ',' +
                        C.mid +
                        ')'
                      : C.white,
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderRadius: 16,
                  transition: 'all .2s',
                  boxShadow:
                    season === se.id
                      ? '0 4px 16px ' + C.skyDark + '40'
                      : 'none',
                }}
              >
                <div
                  style={{
                    ...SF,
                    fontSize: 16,
                    color: season === se.id ? C.white : C.mid,
                    fontWeight: 300,
                  }}
                >
                  {se.abbr}
                </div>
                <div
                  style={{
                    ...SS,
                    fontSize: 9,
                    color: season === se.id ? C.white + 'cc' : C.skyMid,
                    marginTop: 3,
                    fontWeight: 300,
                  }}
                >
                  {se.label}
                </div>
              </div>
            ))}
          </div>
          {season && (
            <div
              style={{
                background:
                  'linear-gradient(135deg,' + C.sky + '40,' + C.vanilla + '50)',
                borderRadius: 24,
                padding: '16px 20px',
                marginBottom: 8,
                border: '1px solid ' + C.sky + '60',
              }}
            >
              <div
                style={{
                  ...SS,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '.22em',
                  color: C.skyDark,
                  marginBottom: 6,
                }}
              >
                ТРЕНДЫ{' '}
                {SEASONS.find((s) => s.id === season).label.toUpperCase()} 2026
              </div>
              <div
                style={{ ...SS, fontSize: 13, color: C.mid, fontWeight: 300 }}
              >
                {TRENDS[season].colors.slice(0, 4).join('  ·  ')}
              </div>
            </div>
          )}
          <PrimaryBtn
            label="Создать образы"
            onClick={makeOutfits}
            disabled={!style || !season}
          />
        </div>
      </div>
    );

  /* OUTFITS */
  if (page === 'outfits' && outfits) {
    const list = outfits.outfits || [];
    const o = list[tab];
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav
            title="ТВОИ ОБРАЗЫ"
            onBack={() => (mode === 'item' ? go('upload') : go('picker'))}
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
            {list.map((oo, i) => (
              <div
                key={i}
                onClick={() => {
                  setTab(i);
                  setOpen(null);
                }}
                style={{
                  flex: 1,
                  padding: '13px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border:
                    '1.5px solid ' + (tab === i ? C.skyDark : C.skyMid + '40'),
                  background:
                    tab === i
                      ? 'linear-gradient(135deg,' +
                        C.sky +
                        '60,' +
                        C.white +
                        ')'
                      : C.white,
                  borderRadius: 24,
                  transition: 'all .2s',
                  boxShadow: tab === i ? '0 4px 16px ' + C.sky + '40' : 'none',
                }}
              >
                <div
                  style={{
                    ...SS,
                    fontSize: 9,
                    color: tab === i ? C.skyDark : C.skyMid,
                    letterSpacing: '.16em',
                    marginBottom: 3,
                    fontWeight: 600,
                  }}
                >
                  ОБРАЗ
                </div>
                <div
                  style={{
                    ...SF,
                    fontSize: 28,
                    color: tab === i ? C.dark : C.mid,
                    lineHeight: 1,
                    fontWeight: 300,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    ...SS,
                    fontSize: 10,
                    color: tab === i ? C.mid : C.skyMid,
                    marginTop: 3,
                    fontWeight: 300,
                  }}
                >
                  {oo.mood}
                </div>
              </div>
            ))}
          </div>
          {o && (
            <div
              style={{
                background: C.white,
                border: '1px solid ' + C.skyMid + '30',
                overflow: 'hidden',
                borderRadius: 50,
                marginBottom: 14,
                boxShadow: '0 4px 24px ' + C.sky + '20',
              }}
            >
              <div style={{ padding: '24px 22px 18px' }}>
                <div
                  style={{
                    ...SF,
                    fontSize: 26,
                    color: C.dark,
                    marginBottom: 8,
                    fontWeight: 400,
                    lineHeight: 1.1,
                  }}
                >
                  {o.name}
                </div>
                <div
                  style={{
                    ...SS,
                    fontSize: 13,
                    color: C.mid,
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {o.description}
                </div>
              </div>
              <Divider />
              <div
                style={{
                  ...SS,
                  fontSize: 11,
                  color: C.skyMid,
                  letterSpacing: '.06em',
                  padding: '0 22px 14px',
                  fontWeight: 300,
                }}
              >
                Нажмите на вещь — найдите в магазинах
              </div>
              {o.items &&
                o.items.map((item, i) => (
                  <div key={i}>
                    <div
                      onClick={() => setOpen(open === i ? null : i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '15px 22px',
                        borderBottom: '1px solid ' + C.skyMid + '15',
                        cursor: 'pointer',
                        background: open === i ? C.sky + '25' : 'transparent',
                        transition: 'background .15s',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            ...SS,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '.18em',
                            color: C.skyMid,
                            marginBottom: 4,
                          }}
                        >
                          {item.category && item.category.toUpperCase()}
                        </div>
                        <div
                          style={{
                            ...SS,
                            fontSize: 15,
                            fontWeight: 500,
                            color: C.dark,
                            marginBottom: 3,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            ...SS,
                            fontSize: 12,
                            color: C.mid,
                            fontWeight: 300,
                          }}
                        >
                          {item.detail}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: open === i ? C.skyDark : C.soft,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          color: open === i ? C.white : C.skyDark,
                          transition: 'all .2s',
                        }}
                      >
                        {open === i ? '↓' : ">"}
                      </div>
                    </div>
                    {open === i && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg,' +
                            C.sky +
                            '30,' +
                            C.vanilla +
                            '40)',
                          padding: '20px 22px',
                          borderBottom: '2px solid ' + C.skyDark,
                        }}
                      >
                        {item.why && (
                          <div
                            style={{
                              ...SF,
                              fontSize: 15,
                              color: C.mid,
                              lineHeight: 1.8,
                              marginBottom: 18,
                              fontStyle: 'italic',
                              fontWeight: 300,
                            }}
                          >
                            {item.why}
                          </div>
                        )}
                        <div
                          style={{
                            ...SS,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '.24em',
                            color: C.skyDark,
                            marginBottom: 12,
                          }}
                        >
                          НАЙТИ В МАГАЗИНАХ
                        </div>
                        <div
                          style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
                        >
                          {MARKETS.map((m, mi) => (
                            <button
                              key={mi}
                              onClick={() =>
                                window.open(
                                  m.u +
                                    encodeURIComponent(
                                      item.search || item.name
                                    ),
                                  '_blank'
                                )
                              }
                              style={{
                                ...SS,
                                background: m.c,
                                color: '#fff',
                                border: 'none',
                                padding: '12px 20px',
                                fontSize: 12,
                                cursor: 'pointer',
                                fontWeight: 500,
                                borderRadius: R.pill,
                              }}
                            >
                              {m.n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
          <PrimaryBtn
            label="Новый разбор"
            onClick={() => {
              setImgSrc(null);
              setImgFile(null);
              setReview(null);
              setOutfits(null);
              go('upload');
            }}
          />
        </div>
      </div>
    );
  }

  /* GUIDE */
  if (page === 'guide')
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav title="ГИД ПО СТИЛЮ" onBack={() => go('home')} />
          <div
            style={{
              ...SF,
              fontSize: 44,
              color: C.dark,
              lineHeight: 0.98,
              marginBottom: 4,
              fontWeight: 300,
            }}
          >
            Основы
            <br />
            стиля
          </div>
          <div
            style={{
              width: 44,
              height: 3,
              background:
                'linear-gradient(90deg,' + C.skyDark + ',' + C.leek + ')',
              marginBottom: 28,
              marginTop: 14,
              borderRadius: 2,
            }}
          />
          {GUIDE.map((g, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid ' + C.skyMid + '20',
                paddingBottom: 24,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  ...SF,
                  fontSize: 22,
                  color: C.dark,
                  fontWeight: 400,
                  marginBottom: 12,
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  ...SS,
                  fontSize: 14,
                  color: C.mid,
                  lineHeight: 1.85,
                  fontWeight: 300,
                }}
              >
                {g.body}
              </div>
            </div>
          ))}
          <div
            style={{
              ...SS,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.24em',
              color: C.skyDark,
              marginBottom: 18,
            }}
          >
            АКТУАЛЬНАЯ ПАЛИТРА 2026
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              ['#B8D8D8', 'Skylight'],
              ['#F2DDD0', 'Vanilla'],
              ['#CFC8D0', 'Lilac'],
              ['#A8A86A', 'Leek'],
              ['#A07858', 'Macch'],
            ].map(([hex, name]) => (
              <div key={hex} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: 52,
                    background: hex,
                    borderRadius: 16,
                    marginBottom: 7,
                    boxShadow: '0 2px 12px ' + hex + '80',
                  }}
                />
                <div
                  style={{
                    ...SS,
                    fontSize: 10,
                    color: C.mid,
                    fontWeight: 400,
                    marginBottom: 2,
                  }}
                >
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  /* TRENDS */
  if (page === 'trends') {
    const t = TRENDS[trendSea];
    const sl = SEASONS.find((s) => s.id === trendSea);
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav title="ТРЕНДЫ · 2026" onBack={() => go('home')} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
            {SEASONS.map((se) => (
              <div
                key={se.id}
                onClick={() => setTrendSea(se.id)}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  border:
                    '1.5px solid ' +
                    (trendSea === se.id ? C.skyDark : C.skyMid + '40'),
                  background:
                    trendSea === se.id
                      ? 'linear-gradient(135deg,' +
                        C.skyDark +
                        ',' +
                        C.mid +
                        ')'
                      : C.white,
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderRadius: 16,
                  transition: 'all .2s',
                }}
              >
                <div
                  style={{
                    ...SF,
                    fontSize: 15,
                    color: trendSea === se.id ? C.white : C.mid,
                    fontWeight: 300,
                  }}
                >
                  {se.abbr}
                </div>
                <div
                  style={{
                    ...SS,
                    fontSize: 9,
                    color: trendSea === se.id ? C.white + 'cc' : C.skyMid,
                    marginTop: 2,
                    fontWeight: 300,
                  }}
                >
                  {se.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              borderLeft: '3px solid ' + C.skyDark,
              paddingLeft: 18,
              marginBottom: 30,
              borderRadius: '0 0 0 4px',
            }}
          >
            <div
              style={{
                ...SS,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '.26em',
                color: C.skyMid,
                marginBottom: 4,
              }}
            >
              {sl.label.toUpperCase()} 2026
            </div>
            <div
              style={{ ...SF, fontSize: 30, color: C.dark, fontWeight: 300 }}
            >
              Актуальные тренды
            </div>
          </div>
          {[
            { title: 'ЦВЕТА СЕЗОНА', items: t.colors, type: 'chip' },
            { title: 'КЛЮЧЕВЫЕ ВЕЩИ', items: t.pieces, type: 'list' },
            { title: 'ТКАНИ', items: t.fabrics, type: 'chip' },
          ].map((sec) => (
            <div
              key={sec.title}
              style={{
                borderBottom: '1px solid ' + C.skyMid + '20',
                paddingBottom: 22,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  ...SS,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '.24em',
                  color: C.skyDark,
                  marginBottom: 16,
                }}
              >
                {sec.title}
              </div>
              {sec.type === 'list' ? (
                sec.items.map((x, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', gap: 18, marginBottom: 10 }}
                  >
                    <span
                      style={{
                        ...SS,
                        fontSize: 10,
                        color: C.skyMid,
                        minWidth: 26,
                        fontWeight: 300,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        ...SS,
                        fontSize: 14,
                        color: C.mid,
                        lineHeight: 1.55,
                        fontWeight: 300,
                      }}
                    >
                      {x}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sec.items.map((x, i) => (
                    <span
                      key={i}
                      style={{
                        ...SS,
                        border: '1px solid ' + C.skyMid + '50',
                        padding: '7px 16px',
                        fontSize: 12,
                        color: C.mid,
                        background: C.white,
                        fontWeight: 300,
                        borderRadius: R.pill,
                      }}
                    >
                      {x}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* HISTORY */
  if (page === 'history')
    return (
      <div style={BG}>
        <div style={{ ...W, ...anim }}>
          <Nav title="ИСТОРИЯ" onBack={() => go('home')} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg,' + C.sky + ',' + C.lilac + ')',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                boxShadow: '0 8px 32px ' + C.sky + '50',
              }}
            >
              <span
                style={{ ...SF, fontSize: 28, color: C.white, fontWeight: 300 }}
              >
                S
              </span>
            </div>
            <div
              style={{ ...SF, fontSize: 28, color: C.dark, fontWeight: 300 }}
            >
              История пуста
            </div>
            <div
              style={{
                ...SS,
                fontSize: 13,
                color: C.skyMid,
                letterSpacing: '.04em',
                fontWeight: 300,
              }}
            >
              Ваши разборы появятся здесь
            </div>
          </div>
        </div>
      </div>
    );

  return null;
}
