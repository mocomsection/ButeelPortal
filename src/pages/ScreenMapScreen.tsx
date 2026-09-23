import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, AlertCircle, ExternalLink } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";

// ── SCREEN MAP DATA ───────────────────────────────────────────────────────
interface ScreenDoc {
  id: string; group: string; name: string; purpose: string;
  actions: string[]; content: string[]; states: string[]; mobile: string; next?: string; path?: string;
}
const SCREEN_GROUPS: [string, string][] = [
  ["Authentication",    "Нэвтрэх ба бүртгэл"],
  ["Onboarding",        "Аккаунт нээх дамжлага"],
  ["Account",           "Аккаунт"],
  ["Catalog",           "Миний каталог"],
  ["New Release",       "Шинэ бүтээл илгээх"],
  ["Sales & Accounting","Орлого ба тайлан"],
  ["System States",     "Алдаа, сануулга ба системийн төлөв"],
];
const SCREEN_DOCS: ScreenDoc[] = [
  { id:"AUTH-01", group:"Authentication", name:"Нэвтрэх", purpose:"Хэрэглэгч бүртгэлтэй email болон нууц үгээр Buteel Creator Portal-д нэвтэрнэ.", actions:["Нэвтрэх","Нууц үг сэргээх","Аккаунт үүсгэх хэсэг рүү шилжих"], content:["Email","Нууц үг","Нэвтрэх товч","Нууц үгээ мартсан уу? холбоос"], states:["Буруу email эсвэл нууц үг","Аккаунт түр хаагдсан","Системтэй холбогдох боломжгүй","Нэвтрэлт амжилттай"], mobile:"Нэг баганатай form; товч болон input талбарууд дор хаяж 44px өндөр байна.", next:"Орлого ба тайлан" },
  { id:"AUTH-02", group:"Authentication", name:"Нууц үг сэргээх", purpose:"Хэрэглэгч бүртгэлтэй email хаягаараа нууц үг сэргээх холбоос авна.", actions:["Email илгээх","Нэвтрэх рүү буцах","Шинэ нууц үг хадгалах"], content:["Бүртгэлтэй email","Илгээх товч","Амжилтын тайлбар","Шинэ нууц үг","Нууц үг давтах"], states:["Email олдсонгүй","Холбоосын хугацаа дууссан","Нууц үг амжилттай шинэчлэгдсэн"], mobile:"Form-ыг дэлгэцийн төвд байрлуулж, алдааг талбарын доор харуулна.", next:"Нэвтрэх" },
  { id:"AUTH-03", group:"Authentication", name:"Аккаунт үүсгэх", purpose:"Хэрэглэгч аккаунтын төрлөө сонгож, үндсэн хэрэглэгч болон хууль ёсны аккаунтын мэдээллийг бүртгэнэ.", actions:["Аккаунтын төрөл сонгох","Үндсэн профайл бөглөх","Аккаунт ба татварын мэдээлэл бөглөх","Үргэлжлүүлэх"], content:["Хувь хүн","Хувиараа бизнес эрхлэгч","Байгууллага","Овог, нэр","Email","Утас","Үндсэн лейблийн нэр"], states:["Заавал бөглөх талбар дутуу","Email бүртгэлтэй байна","Регистрийн формат буруу","Мэдээлэл хадгалагдсан"], mobile:"Алхамчилсан wizard байна. Нэг дэлгэцэд хэт олон талбар шахахгүй.", next:"Үйлчилгээний нөхцөл зөвшөөрөх" },
  { id:"OB-01", path:"/onboarding/account-type", group:"Onboarding", name:"Аккаунтын төрөл сонгох",       purpose:"Бүртгүүлсний дараа хэрэглэгч аккаунтынхаа төрлийг сонгоно: Хувь хүн / Жижиг бизнес / Байгууллага.", actions:["Аккаунт төрөл сонгох","Үргэлжлүүлэх"], content:["Хувь хүн / Уран бүтээлч","Жижиг бизнес / Студи","Байгууллага / Лейбл"], states:["Сонголт хийгдээгүй (товч disabled)","Сонголт хийгдсэн"], mobile:"Card-ууд нэг баганаар харагдана.", next:"Лейбл тохиргоо" },
  { id:"OB-02", path:"/onboarding/label",        group:"Onboarding", name:"Лейбл тохиргоо",               purpose:"Лейблийн нэр болон артистын харагдах нэрийг бүртгэнэ. Бүх бүтээл энэ лейбл дор харьяалагдана. Эхний хэрэглэгч Main User болно.", actions:["Лейблийн нэр оруулах","Артист нэр оруулах","Аккаунтын бүтцийг харах","Үргэлжлүүлэх"], content:["Лейблийн нэр","Артист / харагдах нэр","Аккаунтын бүтэц диаграм","Main User мэдэгдэл"], states:["Нэр дутуу (товч disabled)","Нэр бөглөсөн"], mobile:"Form нэг баганатай байна.", next:"Гэрээ сонголт" },
  { id:"OB-03", path:"/onboarding/agreements",   group:"Onboarding", name:"Гэрээ сонголт",                purpose:"Дуу түгээх (заавал) болон нэмэлт үйлчилгээний гэрээнүүдийг (PRBT, OTT Karaoke, Sync) сонгоно. Гэрээнүүдийг expand хийж нээгдэх үйлчилгээнүүдийг харна.", actions:["Гэрээ expand хийх","Гэрээ сонгох / цуцлах","Нийт нээгдэх үйлчилгээ харах","Гэрээнд зөвшөөрч үргэлжлүүлэх"], content:["Дуу түгээх гэрээ (заавал)","PRBT гэрээ","OTT Karaoke гэрээ","Sync Licensing гэрээ","Нээгдэх үйлчилгээний хураангуй"], states:["Distribution заавал — цуцлах боломжгүй","Нэмэлт гэрээ toggle болно"], mobile:"Гэрээ card бүр accordion байна.", next:"Дуусгах" },
  { id:"OB-04", path:"/onboarding/complete",     group:"Onboarding", name:"Аккаунт нээлтийн дүгнэлт",   purpose:"Onboarding дуусч аккаунт амжилттай үүссэнийг баталгаажуулна. Лейбл, Main User үүрэг, гарын үсэг зурсан гэрээ, нээгдсэн үйлчилгээнүүдийг харуулна.", actions:["Төлбөрийн мэдээлэл нэмэх","Платформ рүү нэвтрэх"], content:["Амжилтын баталгаа","Аккаунтын бүтэц","Main User мэдэгдэл","Нээгдсэн үйлчилгээ"], states:["Амжилттай үүссэн"], mobile:"Бүх мэдээлэл card хэлбэрт нэг баганаар харагдана.", next:"Орлого ба тайлан" },
  { id:"AUTH-04", group:"Authentication", name:"Үйлчилгээний нөхцөл зөвшөөрөх", purpose:"Хэрэглэгч үйлчилгээний нөхцөл, нууцлалын бодлого, төлбөрийн нөхцөл болон бүтээл илгээх дүрэмтэй танилцаж зөвшөөрнө.", actions:["Баримт бичиг нээх","Зөвшөөрөх","Буцах"], content:["Үйлчилгээний нөхцөл","Нууцлалын бодлого","Төлбөрийн нөхцөл","Бүтээл илгээх дүрэм","Зөвшөөрөх checkbox"], states:["Зөвшөөрөл өгөөгүй","Шинэ хувилбар дахин зөвшөөрөх шаардлагатай","Зөвшөөрөл хадгалагдсан"], mobile:"Урт текстийг тусдаа scroll бүхий modal эсвэл хуудас дээр харуулна.", next:"Орлого ба тайлан" },
  { id:"ACC-01", group:"Account", name:"Аккаунтын ерөнхий төлөв", purpose:"Аккаунтын баталгаажуулалт, гэрээ, татвар, банк, төлбөр авах болон шинэ бүтээл илгээх боломжийг нэг дор харуулна.", actions:["Дутуу алхам руу шилжих","Гэрээ харах","Баталгаажуулалтын дэлгэрэнгүй харах"], content:["Аккаунтын төлөв","Баталгаажуулалтын төлөв","Гэрээний төлөв","Татварын мэдээлэл","Банкны мэдээлэл","Төлбөр авах боломж","Шинэ бүтээл илгээх боломж"], states:["Баталгаажуулалт дутуу","Гэрээ идэвхгүй","Төлбөрийн мэдээлэл дутуу","Бүх тохиргоо бүрэн"], mobile:"Status card-уудыг нэг баганад байрлуулж, шаардлагатай үйлдлийг card бүр дээр товч харуулна." },
  { id:"ACC-02", group:"Account", name:"Профайл", purpose:"Порталд нэвтэрч байгаа үндсэн хэрэглэгчийн хувийн мэдээллийг харуулж, зөвшөөрөгдсөн мэдээллийг засварлана.", actions:["Профайл засах","Email баталгаажуулах","Утас шинэчлэх","Нууц үг солих"], content:["Овог","Нэр","Харагдах нэр","Email","Утасны дугаар","Хэлний сонголт"], states:["Email баталгаажаагүй","Утасны формат буруу","Өөрчлөлт хадгалагдсан"], mobile:"Талбарууд нэг баганатай; хадгалах товч доод хэсэгт тогтвортой харагдаж болно." },
  { id:"ACC-03", group:"Account", name:"Аккаунт ба татварын мэдээлэл", purpose:"Аккаунтын төрлөөс хамаарсан хууль ёсны, татвар, НӨАТ болон үндсэн лейблийн мэдээллийг харуулна.", actions:["Мэдээлэл бөглөх","Баталгаажуулалтад илгээх","Өөрчлөлтийн хүсэлт гаргах"], content:["Аккаунтын төрөл","Хууль ёсны нэр","Регистр","Татвар төлөгчийн дугаар","НӨАТ төлөгч эсэх","Үндсэн лейблийн нэр","Хаяг","Холбоо барих мэдээлэл"], states:["Мэдээлэл дутуу","Шалгаж байна","Баталгаажсан","Засвар шаардсан","Хууль ёсны мэдээлэл шууд засах боломжгүй"], mobile:"Аккаунтын төрлөөр хэсгүүдийг нөхцөлт байдлаар харуулна." },
  { id:"ACC-04", group:"Account", name:"Түгээлтийн гэрээ", purpose:"Тухайн аккаунтын түгээлтийн гэрээ, хамрах үйлчилгээ, хугацаа болон төлөвийг харуулна.", actions:["Гэрээ харах","Баримт бичиг нээх","Тусламж авах"], content:["Гэрээний дугаар","Гэрээний төлөв","Эхлэх огноо","Дуусах огноо","Үйлчилгээний хамрах хүрээ","Нутаг дэвсгэр","Онцгой эрхийн нөхцөл"], states:["Гэрээ эхлээгүй","Хянагдаж байна","Идэвхтэй","Хугацаа дууссан","Түр түдгэлзсэн"], mobile:"Гэрээний үндсэн мэдээллийг card хэлбэрээр, урт баримтыг тусдаа viewer-ээр харуулна." },
  { id:"ACC-05", group:"Account", name:"Үйлчилгээний нөхцөл ба бодлого", purpose:"Одоогийн хүчин төгөлдөр нөхцөл болон хэрэглэгчийн зөвшөөрсөн хувилбар, огноог харуулна.", actions:["Нөхцөл харах","Шинэ хувилбар зөвшөөрөх"], content:["Үйлчилгээний нөхцөл","Нууцлалын бодлого","Төлбөрийн нөхцөл","Бүтээл илгээх дүрэм","Зөвшөөрсөн хувилбар","Зөвшөөрсөн огноо"], states:["Хүчинтэй","Дахин зөвшөөрөх шаардлагатай","Зөвшөөрөл хадгалагдаагүй"], mobile:"Баримт бүрийг accordion эсвэл list байдлаар харуулна." },
  { id:"ACC-06", group:"Account", name:"Төлбөр ба банкны мэдээлэл", purpose:"Төлбөр хүлээн авах банк, татвар, eBarimt болон төлбөр авах боломжийн мэдээллийг харуулна.", actions:["Банкны мэдээлэл хадгалах","eBarimt заавар харах","Баталгаажуулалтад илгээх"], content:["Төлбөр хүлээн авагчийн нэр","Регистр / байгууллагын регистр","Татвар төлөгчийн дугаар","НӨАТ төлөгч эсэх","Банк","Данс","Данс эзэмшигч","eBarimt төлөв","Төлбөр авах боломж"], states:["Мэдээлэл дутуу","Банкны мэдээлэл шалгаж байна","eBarimt баталгаажуулалт хүлээж байна","Төлбөр авах боломжтой","Төлбөр авах боломжгүй"], mobile:"Sensitive мэдээллийг хэсэгчлэн нууцалж, edit горимд бүрэн харуулна." },
  { id:"ACC-07", group:"Account", name:"Аюулгүй байдал", purpose:"Нууц үг, нэвтрэлтийн түүх, идэвхтэй session болон аюулгүй байдлын үндсэн тохиргоог удирдана.", actions:["Нууц үг солих","Session дуусгах","Сэжигтэй нэвтрэлтийг мэдээлэх"], content:["Нэвтрэх email","Утас","Нууц үг солих","Нэвтэрсэн түүх","Идэвхтэй session"], states:["Нууц үг сул","Session дууссан","Сэжигтэй нэвтрэлт","Өөрчлөлт хадгалагдсан"], mobile:"Session жагсаалтыг card хэлбэрээр харуулна." },
  { id:"ACC-08", group:"Account", name:"Тусламж ба холбоос", purpose:"FAQ, заавар, ClickUp form болон холбоо барих сувгууд руу чиглүүлнэ.", actions:["Тусламжийн хүсэлт илгээх","FAQ нээх","Холбоо барих"], content:["Тусламжийн хүсэлт","FAQ","Заавар, мэдлэгийн сан","Email холбоо","ClickUp form"], states:["External link нээгдэхгүй","Холбоос хуучирсан","Хүсэлт амжилттай илгээгдсэн"], mobile:"Link card бүр тодорхой гарчиг, тайлбар, external icon-той байна." },
  { id:"CAT-01", group:"Catalog", name:"Каталогийн жагсаалт", purpose:"Хэрэглэгч өөрийн аккаунтад хамаарах бүх бүтээлийг хайж, шүүж, төлөвөөр нь харна.", actions:["Хайх","Төлөвөөр шүүх","Бүтээлийн төрлөөр шүүх","Жагсаалт / card харагдац солих","Дэлгэрэнгүй нээх"], content:["Cover art","Бүтээлийн нэр","Уран бүтээлч","Төлөв","Лейбл","Нээлтийн огноо","UPC","Дууны тоо","Action needed badge"], states:["Каталог хоосон","Хайлтын үр дүн олдсонгүй","Ачаалж байна","Серверийн алдаа","Засвар шаардлагатай бүтээл байна"], mobile:"Desktop table-ийг шахахгүй; card/list хэлбэрт автоматаар шилжинэ.", next:"Бүтээлийн дэлгэрэнгүй" },
  { id:"CAT-02", group:"Catalog", name:"Бүтээлийн дэлгэрэнгүй", purpose:"Бүтээлийн metadata, дууны жагсаалт, түгээлтийн төлөв, үйлчилгээний код болон үйл ажиллагааны түүхийг харуулна.", actions:["Tab солих","Дууны дэлгэрэнгүй нээх","Тусламжийн form нээх","Засварын тайлбар харах"], content:["Бүтээлийн мэдээлэл","Дууны жагсаалт","Түгээлтийн төлөв","Үйлчилгээний код","Үйл ажиллагааны түүх"], states:["Шалгаж байна","Засвар шаардсан","Батлагдсан","Түгээлтэд бэлдэж байна","Баталгаажсан","Амжилтгүй"], mobile:"Tabs-ийг horizontal scroll эсвэл segmented list хэлбэрээр харуулна." },
  { id:"CAT-03", group:"Catalog", name:"Дууны дэлгэрэнгүй", purpose:"Тухайн дууны metadata, оролцогч, audio файл, explicit төлөв болон үйлчилгээний кодыг харуулна.", actions:["Metadata харах","Оролцогчдын мэдээлэл харах","Audio төлөв харах","Service code харах"], content:["Дууны нэр","ISRC","Уран бүтээлч","Үргэлжлэх хугацаа","Genre","Хэл","Explicit","Оролцогчид","PRBT/OTT код"], states:["ISRC дутуу","Audio файл боловсруулахад алдаа","Service code хүлээгдэж байна","Мэдээлэл баталгаажсан"], mobile:"Metadata-г label-value card хэлбэрээр харуулна." },
  { id:"CAT-04", group:"Catalog", name:"Түгээлтийн төлөв", purpose:"Үйлчилгээ тус бүрийн илгээсэн, баталгаажсан, амжилтгүй төлөв болон service code-ийг харуулна.", actions:["Үйлчилгээний мөр дэлгэх","Алдааны шалтгаан харах","Тусламж авах"], content:["Үйлчилгээ","Төлөв","Илгээсэн огноо","Баталгаажсан огноо","PRBT код","OTT код","Алдааны шалтгаан"], states:["Бэлтгэж байна","Гараар илгээсэн","Баталгаажсан","Амжилтгүй","Хамаарахгүй"], mobile:"Service бүрийг status card болгон харуулна." },
  { id:"CAT-05", group:"Catalog", name:"Үйл ажиллагааны түүх", purpose:"Submission, QC, approval, catalog болон delivery төлөвийн өөрчлөлтийг он дарааллаар харуулна.", actions:["Түүхийн мөр дэлгэх","Шалтгаан / тайлбар харах"], content:["Үйлдэл","Огноо","Төлөв","Тайлбар","Дотоод / хэрэглэгчийн үйлдэл"], states:["Түүх байхгүй","Шинэ үйлдэл нэмэгдсэн","Түүх ачаалж чадсангүй"], mobile:"Vertical timeline байдлаар харуулна." },
  { id:"REL-01", group:"New Release", name:"Шинэ бүтээл эхлүүлэх", purpose:"Хэрэглэгч бүтээлийн төрлөө сонгож шинэ submission-ийн ноорог үүсгэнэ.", actions:["Single сонгох","EP сонгох","Album сонгох","Compilation сонгох","Ноорог үргэлжлүүлэх"], content:["Бүтээлийн төрөл","Тайлбар","Ноорог бүтээлийн жагсаалт"], states:["Гэрээ идэвхгүй тул эхлүүлэх боломжгүй","Баталгаажуулалт дутуу","Ноорог хадгалагдсан"], mobile:"Release type card-ууд 2×2 эсвэл нэг баганаар байрлана.", next:"Бүтээлийн тохиргоо" },
  { id:"REL-02", group:"New Release", name:"Бүтээлийн тохиргоо", purpose:"Бүтээлийн үндсэн metadata, cover art, уран бүтээлч, төрөл болон нээлтийн огноог авна.", actions:["Мэдээлэл хадгалах","Cover art upload хийх","Дараагийн алхам руу шилжих"], content:["Бүтээлийн нэр","Хувилбар","Үндсэн уран бүтээлч","Төрөл","Genre","Metadata хэл","Нээлтийн огноо","Cover art","Үндсэн лейбл"], states:["Cover art хэмжээ буруу","Огноо буруу","Заавал бөглөх талбар дутуу","Autosave амжилттай"], mobile:"Алхамчилсан form ба sticky үргэлжлүүлэх товч ашиглана.", next:"Дууны мэдээлэл" },
  { id:"REL-03", group:"New Release", name:"Дууны мэдээлэл", purpose:"Single, EP эсвэл Album-д хамаарах нэг эсвэл олон дууны metadata болон audio файлыг бүртгэнэ.", actions:["Дуу нэмэх","Дуу устгах","Audio upload хийх","ISRC оруулах / үүсгэх хүсэлт","Дараалал өөрчлөх"], content:["Дууны нэр","Хувилбар","Уран бүтээлч","ISRC","Audio file","Үргэлжлэх хугацаа","Genre","Хэл","Explicit","Lyrics"], states:["Audio format буруу","Файл хэт том","Upload тасарсан","ISRC давхардсан","Track metadata дутуу"], mobile:"Дуу бүр accordion card байна. Олон дууг нэг дор урт form болгохгүй.", next:"Оролцогчид" },
  { id:"REL-04", group:"New Release", name:"Оролцогчид ба зохиолын мэдээлэл", purpose:"Уран бүтээлч, composer, lyricist, producer, publisher болон CMO мэдээллийг дуу бүрээр бүртгэнэ.", actions:["Оролцогч нэмэх","Үүрэг сонгох","Publisher оруулах","CMO мэдээлэл оруулах","Бүх дуунд хуулах"], content:["Үндсэн уран бүтээлч","Хамтарсан уран бүтээлч","Хөгжмийн зохиолч","Үгийн зохиолч","Продюсер","Publisher","CMO"], states:["Оролцогч давхардсан","Үүрэг сонгоогүй","Composer / lyricist дутуу","CMO мэдээлэл тодорхойгүй"], mobile:"Recipient/role мөрүүдийг editable card хэлбэрээр харуулна.", next:"Түгээлтийн сонголт" },
  { id:"REL-05", group:"New Release", name:"Түгээлтийн сонголт", purpose:"Гэрээний хамрах хүрээнд боломжтой үйлчилгээнүүдийг сонгож, шаардлагатай тусгай мэдээллийг авна.", actions:["Sonsy Music Streaming сонгох","PRBT сонгох","OTT Karaoke сонгох","Үйлчилгээний шаардлага харах"], content:["Үйлчилгээний жагсаалт","Гэрээний хамрах хүрээ","PRBT segment мэдээлэл","Тайлбар"], states:["Үйлчилгээ гэрээнд ороогүй","PRBT мэдээлэл дутуу","Үйлчилгээ түр боломжгүй"], mobile:"Service card бүр toggle болон нөхцөлт нэмэлт талбартай байна.", next:"Хянаж илгээх" },
  { id:"REL-06", group:"New Release", name:"Хянаж илгээх", purpose:"Илгээхээс өмнө бүх metadata, файл, оролцогч, үйлчилгээний сонголт болон алдааг нэг дор шалгана.", actions:["Алдаатай хэсэг рүү очих","Ноорог хадгалах","Илгээх","Буцах"], content:["Бүтээлийн хураангуй","Дууны хураангуй","Оролцогчид","Түгээлтийн сонголт","Дутуу мэдээлэл","Анхааруулга"], states:["Blocking error","Warning","Бүх шалгалт амжилттай","Submission хийж байна"], mobile:"Алдааны summary-г хуудасны эхэнд, section card бүр дээр badge-тай харуулна.", next:"Илгээсэн төлөв" },
  { id:"REL-07", group:"New Release", name:"Илгээсэн төлөв", purpose:"Submission амжилттай үүссэнийг баталгаажуулж, дараагийн алхам болон хүлээгдэж буй хугацааг тайлбарлана.", actions:["Бүтээлийн дэлгэрэнгүй харах","Каталог руу буцах","Шинэ бүтээл эхлүүлэх"], content:["Submission дугаар","Илгээсэн огноо","Одоогийн төлөв","Дараагийн алхам"], states:["Амжилттай илгээгдсэн","Submission үүсгэхэд алдаа","Давхар илгээлт илэрсэн"], mobile:"Амжилтын card болон хоёр үндсэн action харуулна." },
  { id:"FIN-01", group:"Sales & Accounting", name:"Орлогын хураангуй", purpose:"Тухайн аккаунтын нийт, хүлээгдэж буй, баталгаажсан болон төлөгдсөн орлогыг хугацаагаар харуулна.", actions:["Хугацаа сонгох","Service-ээр шүүх","Sales type-аар шүүх","Statement нээх"], content:["Нийт орлого","Хүлээгдэж буй дүн","Баталгаажсан дүн","Төлөгдсөн дүн","Service задаргаа","Sales type задаргаа","Шилдэг бүтээл","Шилдэг дуу"], states:["Орлогын мэдээлэл байхгүй","Тооцоолол явагдаж байна","Тайлан бэлэн","Өгөгдөл ачаалж чадсангүй"], mobile:"Summary KPI card-ууд, дараа нь collapse filter ба ranked list харуулна.", next:"Statement жагсаалт" },
  { id:"FIN-02", group:"Sales & Accounting", name:"Statement жагсаалт", purpose:"Тайлангийн хугацаа, төлөв, авах дүн болон төлбөрийн төлөвөөр statement-үүдийг жагсаана.", actions:["Statement нээх","Хугацаагаар шүүх","Төлөвөөр шүүх"], content:["Тайлангийн хугацаа","Statement төлөв","Нийт дүн","Төлөх дүн","Төлбөрийн төлөв"], states:["Statement байхгүй","Тооцоолж байна","Бэлэн","Засварлагдсан statement"], mobile:"Statement бүр нэг card байна.", next:"Statement дэлгэрэнгүй" },
  { id:"FIN-03", group:"Sales & Accounting", name:"Statement дэлгэрэнгүй", purpose:"Хэрэглэгчид ногдох орлогыг үйлчилгээ, sales type, бүтээл болон дуугаар нарийвчлан харуулна.", actions:["Үйлчилгээ шүүх","Sales type шүүх","Бүтээл / дуу шүүх","Мөр дэлгэх"], content:["Үйлчилгээ","Sales type","Бүтээл","Дуу","ISRC","Хэрэглээ","Орлогын суурь дүн","Хэрэглэгчид ногдох дүн","Төлбөрийн төлөв"], states:["Мөр match хийгдээгүй","CMO claim нөлөөлсөн","Adjustment орсон","Төлбөр хүлээгдэж байна"], mobile:"Detail table-ийг card list болгон хөрвүүлнэ; filter bottom sheet ашиглаж болно." },
  { id:"FIN-04", group:"Sales & Accounting", name:"Төлбөрийн төлөв", purpose:"eBarimt, finance review, баталгаажуулалт болон банкны шилжүүлгийн явцыг ойлгомжтой харуулна.", actions:["eBarimt заавар харах","Баримт илгээх","Банкны мэдээлэл засах","Тусламж авах"], content:["Тооцоолсон дүн","eBarimt алхам","Санхүүгийн хяналт","Төлбөр баталсан огноо","Шилжүүлсэн огноо"], states:["eBarimt баталгаажуулалт хүлээж байна","Баримт илгээх шаардлагатай","Санхүүгийн хяналтад","Батлагдсан","Төлөгдсөн","Засвар шаардлагатай"], mobile:"Progress stepper болон шаардлагатай action card харуулна." },
  { id:"FIN-05", group:"Sales & Accounting", name:"CMO claim хураангуй", purpose:"CMO claim нь тухайн орлогод нөлөөлсөн тохиолдолд хэрэглэгчид ойлгомжтой, хязгаарлагдмал тайлбар харуулна.", actions:["Тайлбар унших","Холбогдох statement мөр нээх","Тусламж авах"], content:["CMO claim төлөв","Хамаарах бүтээл / дуу","Нөлөөлсөн дүнгийн тайлбар","Нэмэлт тайлбар"], states:["Claimed","Partially claimed","Unclaimed","Manual review required"], mobile:"Дэлгэрэнгүй reconciliation биш, товч info card байна." },
  { id:"SYS-01", group:"System States", name:"Хоосон төлөв — каталог", purpose:"Аккаунтад бүтээл байхгүй үед дараагийн зөв үйлдлийг санал болгоно.", actions:["Шинэ бүтээл илгээх","Заавар харах"], content:["Хоосон төлөвийн дүрслэл","Тайлбар","Үндсэн action"], states:["Шинэ аккаунт","Filter үр дүнгүй"], mobile:"Төвлөрсөн, нэг үндсэн товчтой байна." },
  { id:"SYS-02", group:"System States", name:"Ачаалж буй төлөв", purpose:"Өгөгдөл татаж буй үед layout үсрэхгүйгээр явцыг харуулна.", actions:["Хүлээх","Цуцлах шаардлагатай урт process бол цуцлах"], content:["Skeleton card","Progress indicator","Тайлбар"], states:["Page loading","File upload","Submission хийх","Report calculation"], mobile:"Skeleton нь бодит mobile layout-тай ижил байна." },
  { id:"SYS-03", group:"System States", name:"Ерөнхий алдаа", purpose:"Системийн түр алдаа гарсан үед ойлгомжтой шалтгаан, дахин оролдох үйлдэл харуулна.", actions:["Дахин оролдох","Буцах","Тусламж авах"], content:["Алдааны гарчиг","Товч тайлбар","Reference ID","Үндсэн action"], states:["500 server error","Network error","Timeout"], mobile:"Алдааны мессеж богино, техникийн бус хэллэгтэй байна." },
  { id:"SYS-04", group:"System States", name:"Хуудас олдсонгүй", purpose:"Буруу эсвэл устсан холбоосоор орсон хэрэглэгчийг аюулгүй үндсэн хэсэг рүү буцаана.", actions:["Миний каталог руу буцах","Нүүр хуудас руу буцах"], content:["404","Тайлбар","Буцах товч"], states:["Устсан release","Хуучин external link"], mobile:"Энгийн төвлөрсөн layout байна." },
  { id:"SYS-05", group:"System States", name:"Session дууссан", purpose:"Нэвтрэлтийн хугацаа дууссан үед хадгалагдаагүй мэдээллийн эрсдэлийг тайлбарлаж дахин нэвтрүүлнэ.", actions:["Дахин нэвтрэх","Ноорог сэргээх"], content:["Session дууссан тайлбар","Autosave төлөв","Нэвтрэх товч"], states:["Autosave амжилттай","Хадгалагдаагүй өөрчлөлт байж болзошгүй"], mobile:"Modal эсвэл full-screen blocking state байна." },
  { id:"SYS-06", group:"System States", name:"Эрх хүрэлцэхгүй", purpose:"Хэрэглэгч нээх эрхгүй эсвэл аккаунтын нөхцөл хангаагүй хэсэгт орсон үед шалтгааныг тайлбарлана.", actions:["Аккаунтын төлөв харах","Гэрээ харах","Тусламж авах"], content:["Хязгаарлалтын шалтгаан","Шаардлагатай нөхцөл","Дараагийн action"], states:["Гэрээ идэвхгүй","Аккаунт баталгаажаагүй","Feature MVP-д идэвхгүй"], mobile:"Banner болон blocking card-ийг хослуулж болно." },
  { id:"SYS-07", group:"System States", name:"Form validation summary", purpose:"Олон талбартай form дээр бүх blocking error болон warning-ийг нэг дор харуулна.", actions:["Алдаатай талбар руу очих","Warning үл харгалзан үргэлжлүүлэх","Засварлах"], content:["Error count","Warning count","Field холбоос","Тайлбар"], states:["Blocking error","Warning","Info"], mobile:"Summary-г form-ийн эхэнд sticky биш боловч тод харагдуулна." },
  { id:"SYS-08", group:"System States", name:"Файл upload алдаа", purpose:"Audio болон cover art upload-ын формат, хэмжээ, тасалдал, давхардлын алдааг ялгаж харуулна.", actions:["Дахин upload хийх","Файл солих","Алдааны шаардлага харах"], content:["Файлын нэр","Upload progress","Алдааны төрөл","Зөвшөөрөгдсөн шаардлага"], states:["Формат буруу","Хэмжээ хэтэрсэн","Upload тасарсан","Файл гэмтсэн","Амжилттай"], mobile:"Progress болон retry action-ийг file card дээр харуулна." },
  { id:"SYS-09", group:"System States", name:"QC засвар шаардсан", purpose:"Дотоод QC шалгалтаар засвар хүссэн хэсэг, тайлбар болон хугацааг хэрэглэгчид ойлгомжтой харуулна.", actions:["Засварлах","QC тайлбар харах","Дахин илгээх","Тусламж авах"], content:["Засварын шалтгаан","Хамаарах section / field","Тайлбар","Огноо","Дахин илгээх action"], states:["Metadata засвар","Audio файл солих","Эрхийн мэдээлэл засах","Оролцогч засах"], mobile:"Issue card бүр section link-тэй байна." },
  { id:"SYS-10", group:"System States", name:"Аккаунт баталгаажуулалт шаардлагатай", purpose:"Шинэ бүтээл илгээх эсвэл төлбөр авахын өмнө ямар мэдээлэл дутууг харуулна.", actions:["Аккаунт ба татвар руу очих","Банкны мэдээлэл рүү очих","Гэрээ харах"], content:["Дутуу алхмын жагсаалт","Төлөв","Тайлбар","Action"], states:["KYC дутуу","Tax дутуу","Bank дутуу","Agreement inactive"], mobile:"Checklist card байдлаар харуулна." },
  { id:"SYS-11", group:"System States", name:"eBarimt — хувь хүний баталгаажуулалт", purpose:"Хувь хүн Buteel-ийн үүсгэсэн eBarimt баримтыг апп дээр баталгаажуулах алхмыг тайлбарлана.", actions:["Заавар харах","Баталгаажуулсан эсэхийг шалгах","Тусламж авах"], content:["Төлбөрийн дүн","Баримтын төлөв","Алхамчилсан заавар","Шалгах товч"], states:["Баримт үүссэн","Хэрэглэгчийн баталгаажуулалт хүлээж байна","Баталгаажсан","Хугацаа дууссан"], mobile:"Step-by-step card болон eBarimt апп руу шилжих боломж байж болно." },
  { id:"SYS-12", group:"System States", name:"eBarimt — бизнес ба байгууллагын баримт", purpose:"Хувиараа бизнес эрхлэгч болон байгууллага төлбөрийн дүнтэй тохирох eBarimt баримтыг Buteel рүү илгээх алхмыг тайлбарлана.", actions:["Баримт илгээх","Баримтын мэдээлэл оруулах","Төлөв шалгах","Засварлах"], content:["Төлөх дүн","Buteel-ийн татварын мэдээлэл","Баримтын дугаар","Илгээсэн огноо","Хяналтын төлөв"], states:["Баримт хүлээж байна","Илгээсэн","Санхүү шалгаж байна","Баталгаажсан","Засвар шаардсан"], mobile:"Баримтын дугаар болон upload / submit action-ийг нэг card дээр харуулна." },
  { id:"SYS-13", group:"System States", name:"Үйлчилгээний нөхцөл шинэчлэгдсэн popup", purpose:"Шинэ Terms хувилбар гарсан үед хэрэглэгчээс дахин зөвшөөрөл авна.", actions:["Өөрчлөлтийг харах","Зөвшөөрөх","Түр хойшлуулах боломжтой бол хойшлуулах"], content:["Шинэ хувилбар","Хүчин төгөлдөр огноо","Гол өөрчлөлт","Зөвшөөрөх checkbox"], states:["Blocking re-acceptance","Non-blocking notification","Зөвшөөрсөн"], mobile:"Full-screen bottom sheet эсвэл modal ашиглаж болно." },
  { id:"SYS-14", group:"System States", name:"Амжилтын сануулга", purpose:"Хадгалах, илгээх, төлбөрийн мэдээлэл шинэчлэх зэрэг үйлдэл амжилттай болсныг баталгаажуулна.", actions:["Үргэлжлүүлэх","Дэлгэрэнгүй харах"], content:["Success icon","Амжилтын мессеж","Дараагийн action"], states:["Saved","Submitted","Verified","Paid"], mobile:"Toast болон том амжилтын page-ийг үйлдлийн жингээр ялгана." },
];

const GROUP_COLORS: Record<string, { bg: string; badge: string; dot: string }> = {
  "Authentication":    { bg: "bg-blue-50 border-blue-100",       badge: "bg-blue-100 text-blue-700",       dot: "bg-blue-500" },
  "Onboarding":        { bg: "bg-violet-50 border-violet-200",   badge: "bg-violet-100 text-violet-700",   dot: "bg-violet-600" },
  "Account":           { bg: "bg-amber-50 border-amber-100",     badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" },
  "Catalog":           { bg: "bg-violet-50 border-violet-100",   badge: "bg-violet-100 text-violet-700",   dot: "bg-violet-500" },
  "New Release":       { bg: "bg-emerald-50 border-emerald-100", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "Sales & Accounting":{ bg: "bg-primary/5 border-violet-200", badge: "bg-primary/10 text-primary", dot: "bg-primary" },
  "System States":     { bg: "bg-zinc-50 border-zinc-200",       badge: "bg-zinc-100 text-zinc-600",       dot: "bg-zinc-400" },
};

// ── SCREEN MAP ────────────────────────────────────────────────────────────

export default function ScreenMapScreen() {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = SCREEN_DOCS.filter(s => {
    const matchGroup = activeGroup === "all" || s.group === activeGroup;
    const q = search.toLowerCase();
    const matchSearch = !q || s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q);
    return matchGroup && matchSearch;
  });

  const groupCounts = SCREEN_GROUPS.map(([key]) => ({
    key, count: SCREEN_DOCS.filter(s => s.group === key).length,
  }));

  return (
    <Shell title="Screen Map & Documentation">
      <div className="rounded-xl p-6 mb-6 text-white overflow-hidden relative" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)" }} />
        <div className="relative flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-white/60 mb-2">UX/UI Design Reference</p>
            <h2 className="text-2xl font-extrabold text-white mb-1">Buteel Creator Portal</h2>
            <p className="text-sm text-white/70 mb-5">Screen Map, Wireframe & System States — дизайнер, product owner болон хөгжүүлэгчдэд зориулсан</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: String(SCREEN_DOCS.length), l: "Нийт дэлгэц ба төлөв" },
                { v: "7",            l: "Үндсэн бүлэг" },
                { v: "Responsive",   l: "Web portal MVP" },
                { v: "Монгол",       l: "Хэрэглэгчид харагдах UI" },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-3">
                  <p className="text-lg font-extrabold text-white">{s.v}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-72 bg-white/10 border border-white/15 rounded-xl p-4">
            <p className="text-xs font-bold uppercase text-white/60 mb-3">Үндсэн урсгал</p>
            <div className="space-y-1.5">
              {[
                ["Login",     "Нэвтрэх → Орлого ба тайлан"],
                ["Register",  "Бүртгэл → Onboarding (4 алхам) → Платформ"],
                ["Portal",    "Орлого ба тайлан (default)"],
                ["Catalog", "Каталог → Бүтээлийн дэлгэрэнгүй"],
                ["Submit",  "Илгээх wizard (4 алхам)"],
                ["Account", "Аккаунт → Татвар / Банк / Гэрээ"],
              ].map(([k, v], i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-xs font-bold bg-white/20 text-white px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">{k}</span>
                  <span className="text-xs text-white/70">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <span className="font-semibold">MVP хамрах хүрээ: </span>
          Каталог · Шинэ бүтээл илгээх · Орлого ба тайлан · Аккаунт · KYC / татвар / eBarimt / банк · CMO claim хураангуй · Монгол хэрэглэгчийн UI · Responsive web portal
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {SCREEN_GROUPS.map(([key, label]) => {
          const c = GROUP_COLORS[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
              <span className="text-xs text-zinc-500">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-zinc-400"
            placeholder="Screen ID, нэр, тайлбараар хайх..." />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setActiveGroup("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${activeGroup === "all" ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"}`}>
            Бүгд ({SCREEN_DOCS.length})
          </button>
          {groupCounts.map(({ key, count }) => {
            const label = SCREEN_GROUPS.find(g => g[0] === key)?.[1] ?? key;
            const shortLabel = label.split(" ")[0];
            return (
              <button key={key} onClick={() => setActiveGroup(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${activeGroup === key ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"}`}>
                {shortLabel} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {(activeGroup === "all" ? SCREEN_GROUPS.map(g => g[0]) : [activeGroup]).map(groupKey => {
        const groupLabel = SCREEN_GROUPS.find(g => g[0] === groupKey)?.[1] ?? groupKey;
        const screens = filtered.filter(s => s.group === groupKey);
        if (screens.length === 0) return null;
        const c = GROUP_COLORS[groupKey];
        return (
          <div key={groupKey} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${c.dot}`} />
              <h3 className="text-lg font-bold text-zinc-900">{groupLabel}</h3>
              <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{screens.length} дэлгэц</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {screens.map(s => (
                <div key={s.id} className={`rounded-xl border overflow-hidden bg-white shadow-sm ${c.bg.split(" ")[1]}`}>
                  <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${c.bg}`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${c.badge}`}>{s.id}</span>
                      <h4 className="font-bold text-zinc-900 truncate">{s.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {s.path && (
                        <button type="button" onClick={() => navigate(s.path!)}
                          className="text-xs font-bold bg-primary text-white px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-primary/90 transition-colors">
                          <ExternalLink size={10} />Харах
                        </button>
                      )}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${c.badge}`}>{groupKey}</span>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-zinc-400 mb-1.5">Screen Purpose</p>
                        <p className="text-sm text-zinc-700 leading-relaxed">{s.purpose}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-zinc-400 mb-1.5">Main User Actions</p>
                        <ul className="space-y-1">
                          {s.actions.map((a, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600">
                              <span className="text-primary mt-0.5 flex-shrink-0">›</span>{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {s.next && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase text-zinc-400">Дараагийн дэлгэц</span>
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ChevronRight size={10} />{s.next}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-zinc-400 mb-1.5">Required Content</p>
                        <div className="flex flex-wrap gap-1">
                          {s.content.map((ct, i) => (
                            <span key={i} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-lg font-medium">{ct}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-zinc-400 mb-1.5">Error / Warning / Status States</p>
                        <div className="space-y-1">
                          {s.states.map((st, i) => {
                            const isErr  = st.toLowerCase().includes("алдаа") || st.toLowerCase().includes("буруу") || st.toLowerCase().includes("error") || st.toLowerCase().includes("амжилтгүй") || st.toLowerCase().includes("дутуу") || st.toLowerCase().includes("тасарсан");
                            const isOk   = st.toLowerCase().includes("амжилттай") || st.toLowerCase().includes("баталгаажсан") || st.toLowerCase().includes("хадгалагдсан") || st.toLowerCase().includes("бэлэн") || st.toLowerCase().includes("paid") || st.toLowerCase().includes("verified");
                            const isWarn = st.toLowerCase().includes("хүлээ") || st.toLowerCase().includes("шалгаж") || st.toLowerCase().includes("warning") || st.toLowerCase().includes("шаардлагатай");
                            return (
                              <div key={i} className={`text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1.5 ${isErr ? "bg-red-50 text-red-700" : isOk ? "bg-green-50 text-green-700" : isWarn ? "bg-amber-50 text-amber-700" : "bg-zinc-50 text-zinc-600"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isErr ? "bg-red-400" : isOk ? "bg-green-400" : isWarn ? "bg-amber-400" : "bg-zinc-300"}`} />
                                {st}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-zinc-400 mb-1.5">Mobile Behavior</p>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700 leading-relaxed">
                          {s.mobile}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={40} className="text-zinc-200 mb-3" />
          <p className="text-zinc-400 font-medium">Дэлгэц олдсонгүй</p>
          <p className="text-sm text-zinc-300 mt-1">"{search}" хайлтад тохирох дэлгэц байхгүй</p>
        </div>
      )}
    </Shell>
  );
}

