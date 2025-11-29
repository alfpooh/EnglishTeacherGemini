import { Scenario } from "./types";

export const SYSTEM_INSTRUCTION = `
You are "Koko", a cheerful, patient, and friendly English tutor for Korean children aged 5-7.
Your goal is to help them practice speaking English through simple conversation.

**Core Behavior:**
1. **Bilingual Teaching:** Explain concepts or give corrections in **Korean (Hangul)**, but always encourage the child to repeat or answer in **English**.
2. **Simple Language:** Use very simple vocabulary and short sentences suitable for a 5-year-old.
3. **Correction:** If the child makes a grammar or pronunciation mistake, gently explain it in Korean, then say the correct English phrase and ask them to repeat it.
4. **Tone:** Be enthusiastic, use emojis, and be very encouraging (e.g., "Good job!", "Wonderful!").

**Session flow:**
- Start by greeting the child warmly.
- Stick to the context of the selected scenario.
- Ask one simple question at a time.
- Wait for the child to answer.

**Output Format:**
- You will be speaking via audio. Keep responses concise so the child doesn't lose focus.
`;

const PRONUNCIATION_LIST = `
단어,IPA,발음 그룹,설명
bus,/bʌs/,무성 /s/,모음 뒤 순수 /s/로 끝나는 형태임
glass,/ɡlæs/,무성 /s/,/s/가 짧고 날카롭게 끝남
dress,/drɛs/,무성 /s/,혀가 닿지 않고 공기만 마찰함
juice,/dʒuːs/,무성 /s/,긴 모음 뒤 가벼운 /s/ 처리됨
ice,/aɪs/,무성 /s/,‘아잇-스’가 아닌 바로 /s/로 닫힘
face,/feɪs/,무성 /s/,2중모음 뒤 /s/로 깨끗하게 종료됨
house,/haʊs/,무성 /s/,"‘하우스’ 아님, /s/에서 바로 끊김"
rice,/raɪs/,무성 /s/,혀 닿지 않고 바람만 남김
place,/pleɪs/,무성 /s/,끝에서 공기 마찰로 끝냄
class,/klæs/,무성 /s/,한국어 ‘클래스’처럼 모음 붙이지 않음
piece,/piːs/,무성 /s/,길게 끌다가 /s/로 날카롭게 끊음
grass,/ɡræs/,무성 /s/,혀는 윗잇몸 근처지만 닿지 않음
press,/prɛs/,무성 /s/,/s/가 짧고 강하게 끝남
space,/speɪs/,무성 /s/,파열 없이 미끄러지듯 끝남
nose,/noʊz/,실제 /z/ 계열,모음 뒤라 실제 발음은 /z/로 흐름이 남
cheese,/tʃiːz/,실제 /z/ 계열,‘즈’로 들리지만 혀가 완전히 닿지 않음
voice,/vɔɪs/,경계형 /s/,"철자는 s, 실제론 /s/와 /z/ 사이 중간 성질임"
goose,/ɡuːs/,/s/ 단독 종성,짧고 날카로운 /s/로 끝남
moose,/muːs/,/s/ 단독 종성,한국어 ‘무-스’가 아니라 ‘무-쓰’보다 더 짧음
mouse,/maʊs/,/s/ 단독 종성,종성 /s/ 전형적 모델로 쓰기 좋음
sun,/sʌn/,무성 /s/ 초성,혀를 띄우고 바람으로 시작됨
soup,/suːp/,무성 /s/ 초성,/s/ 뒤에 긴 모음이 이어짐
salt,/sɔːlt/,무성 /s/ 초성,s가 가장 앞에서 강하게 시작됨
sand,/sænd/,무성 /s/ 초성,모음 앞에서 공기압이 크게 남
sea,/siː/,무성 /s/ 초성,긴 /iː/로 이어져 부드럽게 넘어감
seat,/siːt/,무성 /s/ 초성,s→i→t로 깨끗한 흐름이 중요함
see,/siː/,무성 /s/ 초성,길고 맑은 모음으로 이어짐
sip,/sɪp/,무성 /s/ 초성,짧은 /ɪ/라 앞의 s가 더 선명해짐
sick,/sɪk/,무성 /s/ 초성,s 뒤 모음이 짧아 매우 또렷해야 함
sing,/sɪŋ/,무성 /s/ 초성,뒤의 /ŋ/ 때문에 초성이 더 강조됨
simple,/ˈsɪmpəl/,무성 /s/ 초성,강세가 있어 s 발음이 매우 뚜렷함
same,/seɪm/,무성 /s/ 초성,/s/에서 /eɪ/로 부드럽게 연결됨
safe,/seɪf/,무성 /s/ 초성,숨을 한 번에 밀며 시작해야 함
sound,/saʊnd/,무성 /s/ 초성,2중모음 /aʊ/가 뒤를 받침
city,/ˈsɪti/,무성 /s/ 초성,c지만 실제 발음은 /s/ 시작임
circle,/ˈsɜːrkəl/,무성 /s/ 초성,서클이 아닌 /sɜr/ 흐름으로 시작됨
soda,/ˈsoʊdə/,무성 /s/ 초성,가벼운 /s/ 뒤 /oʊ/로 이어짐
summer,/ˈsʌmər/,무성 /s/ 초성,첫 소리를 길게 숨으로 밀어줌
Sunday,/ˈsʌndeɪ/,무성 /s/ 초성,초성 s 뒤 강세가 와서 클리어함
science,/ˈsaɪəns/,무성 /s/ 초성,/s/ 뒤 diphthong 이동이 중요함
think,/θɪŋk/,무성 /θ/,"‘씽크’ 아님, 혀를 물고 바람만 냄"
thin,/θɪn/,무성 /θ/,짧게 ‘쓰’로 시작됨
thick,/θɪk/,무성 /θ/,혀 끝을 반드시 내밀어야 함
thumb,/θʌm/,무성 /θ/,th 뒤의 ʌ 발음이 중요함
thunder,/ˈθʌndər/,무성 /θ/,첫소리에서 바람을 충분히 냄
thousand,/ˈθaʊzənd/,무성 /θ/,"앞에서 /θ/, 뒤는 /z/로 이어짐"
theater,/ˈθiːətər/,무성 /θ/,길게 찢는 느낌의 /θ/임
theme,/θiːm/,무성 /θ/,/θ/→/iː/ 흐름이 중요함
theory,/ˈθɪəri/,무성 /θ/,한국어식 ‘띠어리’ 금지됨
thief,/θiːf/,무성 /θ/,가벼운 공기 압력으로 시작됨
thinly,/ˈθɪnli/,무성 /θ/,약한 강세로도 /θ/가 유지됨
thickness,/ˈθɪknəs/,무성 /θ/,혀 위치가 정확해야 발음됨
thorough,/ˈθɜːroʊ/,무성 /θ/,영국·미국식 모두 /θ/로 시작됨
thermostat,/ˈθɜːrmoʊstæt/,무성 /θ/,긴 단어도 초성 패턴 동일함
Thursday,/ˈθɜːrzdeɪ/,무성 /θ/,th에서 반드시 바람을 냄
thorn,/θɔːrn/,무성 /θ/,모음 /ɔː/로 부드럽게 이동됨
thaw,/θɔː/,무성 /θ/,짧은 단어로 연습하기 좋음
thesis,/ˈθiːsɪs/,무성 /θ/,앞뒤 모두 /θ/ 특성이 들어감
thermometer,/θərˈmɒmɪtər/,무성 /θ/,초성 /θ/가 길어짐
thrill,/θrɪl/,무성 /θ/,/θ/ 후에 /r/ 연결되는 난이도 높은 조합임
this,/ðɪs/,유성 /ð/,혀를 물고 성대 울림이 남
that,/ðæt/,유성 /ð/,/ð/ 뒤 /æ/가 크게 열림
these,/ðiːz/,유성 /ð/,자연스러운 울림 후 /z/로 이어짐
those,/ðoʊz/,유성 /ð/,길고 부드럽게 연결됨
then,/ðɛn/,유성 /ð/,"/d/ 아님, 울림이 꼭 필요함"
them,/ðɛm/,유성 /ð/,혀를 약하게 내밀고 시작됨
though,/ðoʊ/,유성 /ð/,매우 부드러운 출발임
thus,/ðʌs/,유성 /ð/,성대 울림이 핵심임
they,/ðeɪ/,유성 /ð/,아이들이 가장 먼저 배울 단어임
their,/ðɛr/,유성 /ð/,"‘데얼’ 금지, /ð/로 시작됨"
there,/ðɛər/,유성 /ð/,논문식 ‘데어’로 읽지 않음
therefore,/ˈðɛərfɔːr/,유성 /ð/,/ð/로 진동 시작됨
themself,/ðəmˈsɛlf/,유성 /ð/,약하게 울림 시작됨
themselves,/ðəmˈsɛlvz/,유성 /ð/,초성 /ð/가 짧고 부드러움
they’re,/ðɛər/,유성 /ð/,축약형도 /ð/로 시작됨
they’ll,/ðeɪl/,유성 /ð/,자연스러운 울림 유지됨
they’d,/ðeɪd/,유성 /ð/,혀만 내밀고 모음으로 이동됨
thither,/ˈðɪðər/,유성 /ð/,고급 단어지만 연습에 좋음
thence,/ðɛns/,유성 /ð/,/ð/ 뒤 t 없이 /ns/로 종결됨
thine,/ðaɪn/,유성 /ð/,고어지만 /ð/ 연습에 유용함
light,/laɪt/,명료 /l/,혀끝을 치경에 붙여서 시작됨
lake,/leɪk/,명료 /l/,/l/ → /eɪ/ 흐름이 중요함
line,/laɪn/,명료 /l/,한국어 ‘라’보다 부드럽게 시작됨
lemon,/ˈlɛmə.n/,명료 /l/,첫 강세에서 /l/이 크게 들림
leaf,/liːf/,명료 /l/,긴 모음 /iː/로 자연스럽게 연결됨
list,/lɪst/,명료 /l/,/l/과 /ɪ/의 높이가 또렷함
lip,/lɪp/,명료 /l/,짧은 모음이라 /l/이 더 선명함
look,/lʊk/,명료 /l/,혀를 확실히 붙여야 정확함
luck,/lʌk/,명료 /l/,/l/에서 혀를 확실히 닿게 함
love,/lʌv/,명료 /l/,/l/에서 울림이 크게 남
long,/lɔːŋ/,명료 /l/,모음으로 자연스럽게 이어짐
late,/leɪt/,명료 /l/,첫소리의 선명한 접촉이 필요함
leave,/liːv/,명료 /l/,길게 끌어도 혀 위치는 같음
less,/lɛs/,명료 /l/,/l/ 뒤 /ɛ/가 넓게 열림
let,/lɛt/,명료 /l/,혀 위치·치경 접촉이 중요함
lemon,/ˈlɛmən/,명료 /l/,반복 단어지만 연습용으로 우수함
little,/ˈlɪtəl/,명료 /l/,미국식에서 t-flap 주의됨
live,/lɪv/,명료 /l/,/l/의 접촉이 핵심적임
lucky,/ˈlʌki/,명료 /l/,/l/ 뒤 /ʌ/로 부드럽게 이동됨
local,/ˈloʊkəl/,명료 /l/,/l/이 문장 앞뒤에서 선명함
red,/rɛd/,권설 /r/,혀를 말고 공기 흐름을 유지함
run,/rʌn/,권설 /r/,절대 혀를 닿게 하지 않음
read,/riːd/,권설 /r/,길게 발음하지만 혀는 떠 있음
rock,/rɑːk/,권설 /r/,한국어 ‘락’과 전혀 다름
rain,/reɪn/,권설 /r/,/r/에서 /eɪ/로 자연스럽게 이동됨
road,/roʊd/,권설 /r/,혀가 입 천장에 닿으면 안 됨
room,/ruːm/,권설 /r/,/uː/로 이어지는 후설 조합임
rule,/ruːl/,권설 /r/,/r/과 /l/ 대비 연습에 최적임
rice,/raɪs/,권설 /r/,L과 발음 경로가 전혀 다름
right,/raɪt/,권설 /r/,시작에서 혀를 말아 올려야 함
round,/raʊnd/,권설 /r/,모음 이동이 커서 연습에 좋음
river,/ˈrɪvər/,권설 /r/,혀가 진동하지 않고 말려 있음
ring,/rɪŋ/,권설 /r/,/r/와 /ŋ/ 조합이 독특함
rise,/raɪz/,권설 /r/,뒤의 /z/ 때문에 흐름이 연결됨
rope,/roʊp/,권설 /r/,혀끝 위치가 가장 중요함
rabbit,/ˈræbɪt/,권설 /r/,/r/ 뒤 /æ/가 크게 벌어짐
robot,/ˈroʊbɑːt/,권설 /r/,혀의 말림 유지가 필수적임
ready,/ˈrɛdi/,권설 /r/,r→ɛ 흐름이 부드럽게 연결됨
remove,/rɪˈmuːv/,권설 /r/,혀끝이 끝까지 뜬 상태임
repeat,/rɪˈpiːt/,권설 /r/,/r/에서 시작하는 리듬이 중요함
really,/ˈrɪəli/,R→L,"r에서 혀를 말고, l에서 붙여야 함"
rarely,/ˈrɛərli/,R→L,rr와 l이 연속으로 등장함
ruler,/ˈruːlər/,R→L→R,r→l→r 순환 구조가 특징임
relay,/ˈriːleɪ/,R→L,r 뒤 l로 혀의 접촉 전환이 중요함
relate,/rɪˈleɪt/,R→L,중간 음절에서 l이 선명해야 함
relax,/rɪˈlæks/,R→L,r와 l 사이 입모양 전환이 큼
religion,/rɪˈlɪdʒən/,R→L,r→l 부드러운 이동이 필요함
release,/rɪˈliːs/,R→L,"앞 r, 뒤 l이 매우 선명해야 함"
rely,/rɪˈlaɪ/,R→L,혀 접촉 유무 차이가 또렷해야 함
real,/ˈriːəl/,R→L,r와 어두운 l /ɫ/ 대비가 중요함
rule,/ruːl/,R→L,r 뒤 l의 혀 접촉이 뚜렷해야 함
rural,/ˈrʊr.əl/,R→R→L,영어 발음 난이도 최상급임
roller,/ˈroʊlər/,R→L→R,혀 말림과 접촉이 반복됨
railroad,/ˈreɪlroʊd/,L→R,l에서 닿고 r에서 말림으로 전환됨
rainfall,/ˈreɪnfɔːl/,R→L,마지막 /ɫ/이 깊은 어두운 L임
realtor,/ˈriːəltər/,R→L,l에서 혀를 붙이는 감각이 중요함
realign,/ˌriːəˈlaɪn/,R→L,두 번째 음절에서 L이 등장함
enrollment,/ɛnˈroʊlmənt/,R→L,r와 l 간 거리가 멀어 연습에 좋음
preliminary,/prɪˈlɪmɪˌnɛri/,R→L,/pr/ 뒤 /l/이 나타나는 구조임
accelerate,/əkˈsɛləˌreɪt/,L→R,"앞에서 l, 뒤에서 r이 연결됨"
`;

export const SCENARIOS: Scenario[] = [
  {
    id: 'daily-chat',
    title: '오늘 어땠어?',
    icon: '🌞',
    promptContext: 'Ask the child about their day. What did they do? Did they have fun? Focus on past tense verbs like "played", "ate", "went".',
    color: 'bg-yellow-400'
  },
  {
    id: 'food',
    title: '맛있는 음식',
    icon: '🍕',
    promptContext: 'Talk about food. Ask what they ate for lunch or what their favorite food is. Teach words like "yummy", "sweet", "spicy".',
    color: 'bg-green-400'
  },
  {
    id: 'seasons',
    title: '계절 이야기',
    icon: '⛄',
    promptContext: 'Talk about the weather and seasons (Spring, Summer, Fall, Winter). Ask what season it is now. Teach words like "hot", "cold", "snow", "rain".',
    color: 'bg-blue-400'
  },
  {
    id: 'friends',
    title: '내 친구들',
    icon: '🎈',
    promptContext: 'Talk about friends. Who is their best friend? What do they like to play together? Teach words like "share", "play", "kind".',
    color: 'bg-pink-400'
  },
  {
    id: 'pronunciation',
    title: '발음 놀이',
    icon: '🎤',
    promptContext: `This session is a 'Pronunciation Clinic' game.
    
    **Goal:** Help the child master difficult English sounds using the provided word list. Focus on S, TH, L, and R sounds.
    
    **Word List Data (CSV Format):**
    ${PRONUNCIATION_LIST}
    
    **Instructions:**
    1. Pick a word from the list. **Start specifically with the 'S' ending words (first section of the list) as requested.**
    2. Say the word clearly to the child.
    3. Ask the child to repeat it.
    4. Listen to their audio input carefully.
    5. Give specific feedback based on the 'Description' (설명) in the list. Explain in simple Korean suitable for a 5-7 year old.
       - Example: "치즈(Cheese)는 '스'가 아니라 '즈' 처럼 들려야 해요. 벌이 날아가는 소리를 내볼까요? Zzzzz!"
    6. If they do well, give big praise! Then move to the next word.
    `,
    color: 'bg-orange-400'
  }
];