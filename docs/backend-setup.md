# Серверийн холболтын тохиргоо

Энэ төсөлд серверийн бүрэлдэхүүн хэсгийг дараах байдлаар төлөвлөсөн.

- Frontend: одоогийн static website болон `/career-test/`
- API: Vercel Node.js Functions (`/api/`)
- Өгөгдлийн сан: Supabase Postgres (RLS асаалттай, public access хаалттай)
- PDF тайлан: серверийн report renderer + Supabase private Storage
- И-мэйл: Resend API

## Одоогоор бэлтгэсэн зүйл

- `supabase/migrations/20261124_create_career_test.sql` — submission, admin login attempt хүснэгт, private report bucket.
- `.env.example` — хэрэгтэй environment variable-ийн нэрс.
- Дараагийн API ажлуудад secret key-г зөвхөн сервер талд ашиглана.

## Гараар хийх нэг удаагийн тохиргоо

1. Supabase project үүсгэж, SQL Editor дээр migration файлын агуулгыг ажиллуулна.
2. Project Settings > API Keys хэсгээс Project URL болон шинэ `sb_secret_...` түлхүүрийг авна. Хэрэв хуучин `service_role` ашиглаж байгаа бол browser талын кодод хэзээ ч байрлуулахгүй.
3. Resend дээр илгээгчийн домэйныг баталгаажуулж API key үүсгэнэ. Туршилтын sender хаягийг production-д ашиглахгүй.
4. Vercel Project Settings > Environment Variables дээр `.env.example` дахь утгуудыг тохируулна. Environment variable өөрчилсний дараа шинэ deployment шаардлагатай.
5. `ADMIN_PASSWORD`-ийг урт, давтагдашгүй нууц үгээр; `ADMIN_SESSION_SECRET`-ийг санамсаргүй 32+ тэмдэгтээр тохируулна.

## Аюулгүй байдлын шийдвэрүүд

- Нийтийн браузер Supabase secret key-г хэзээ ч авахгүй.
- Сурагч зөвхөн бүртгэл, тестийн хариултыг илгээнэ; бусдын хариуг унших API байхгүй.
- Оноог браузерээс ирсэн үр дүнд итгэж авахгүй; сервер эх raw response-оос дахин тооцно.
- Админ зөвшөөрөөгүй тайлан имэйл рүү явахгүй.
- Тайлангийн bucket public биш байна.
- Email retry нь ижил submission-д давхар илгээлт үүсгэхгүй idempotency guard-тай байх ёстой.

## Анхаарах зүйл

Migration болон environment variable-ууд нь зөвхөн дэд бүтцийн бэлтгэл. Supabase project, Resend account, Vercel environment variables-ийг эзэмшигч өөрөө үүсгэж/тохируулсны дараа серверийн төгсгөлийн цэгүүдийг production-д холбож турших ёстой.
