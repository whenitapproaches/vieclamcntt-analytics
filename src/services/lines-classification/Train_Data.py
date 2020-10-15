import regex as re
from underthesea import word_tokenize
import time
import pickle
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.pipeline import Pipeline
import numpy as np
import sys
import os

uniChars = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ"
unsignChars = "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIOOOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU"
 
def loaddicchar():
    dic = {}
    char1252 = 'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ'.split(
        '|')
    charutf8 = "à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ".split(
        '|')
    for i in range(len(char1252)):
        dic[char1252[i]] = charutf8[i]
    return dic
dicchar = loaddicchar()

# Hàm chuyển Unicode dựng sẵn về Unicde tổ hợp (phổ biến hơn)
def convert_unicode(txt):
    return re.sub(
        r'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ',
        lambda x: dicchar[x.group()], txt)

bang_nguyen_am = [['a', 'à', 'á', 'ả', 'ã', 'ạ', 'a'],
                  ['ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'aw'],
                  ['â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ', 'aa'],
                  ['e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'e'],
                  ['ê', 'ề', 'ế', 'ể', 'ễ', 'ệ', 'ee'],
                  ['i', 'ì', 'í', 'ỉ', 'ĩ', 'ị', 'i'],
                  ['o', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'o'],
                  ['ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'oo'],
                  ['ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ', 'ow'],
                  ['u', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'u'],
                  ['ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự', 'uw'],
                  ['y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ', 'y']]
bang_ky_tu_dau = ['', 'f', 's', 'r', 'x', 'j']

nguyen_am_to_ids = {}

for i in range(len(bang_nguyen_am)):
    for j in range(len(bang_nguyen_am[i]) - 1):
        nguyen_am_to_ids[bang_nguyen_am[i][j]] = (i, j)

def chuan_hoa_dau_tu_tieng_viet(word):
    if not is_valid_vietnam_word(word):
        return word

    chars = list(word)
    dau_cau = 0
    nguyen_am_index = []
    qu_or_gi = False
    for index, char in enumerate(chars):
        x, y = nguyen_am_to_ids.get(char, (-1, -1))
        if x == -1:
            continue
        elif x == 9:  # check qu
            if index != 0 and chars[index - 1] == 'q':
                chars[index] = 'u'
                qu_or_gi = True
        elif x == 5:  # check gi
            if index != 0 and chars[index - 1] == 'g':
                chars[index] = 'i'
                qu_or_gi = True
        if y != 0:
            dau_cau = y
            chars[index] = bang_nguyen_am[x][0]
        if not qu_or_gi or index != 1:
            nguyen_am_index.append(index)
    if len(nguyen_am_index) < 2:
        if qu_or_gi:
            if len(chars) == 2:
                x, y = nguyen_am_to_ids.get(chars[1])
                chars[1] = bang_nguyen_am[x][dau_cau]
            else:
                x, y = nguyen_am_to_ids.get(chars[2], (-1, -1))
                if x != -1:
                    chars[2] = bang_nguyen_am[x][dau_cau]
                else:
                    chars[1] = bang_nguyen_am[5][dau_cau] if chars[1] == 'i' else bang_nguyen_am[9][dau_cau]
            return ''.join(chars)
        return word

    for index in nguyen_am_index:
        x, y = nguyen_am_to_ids[chars[index]]
        if x == 4 or x == 8:  # ê, ơ
            chars[index] = bang_nguyen_am[x][dau_cau]
            # for index2 in nguyen_am_index:
            #     if index2 != index:
            #         x, y = nguyen_am_to_ids[chars[index]]
            #         chars[index2] = bang_nguyen_am[x][0]
            return ''.join(chars)

    if len(nguyen_am_index) == 2:
        if nguyen_am_index[-1] == len(chars) - 1:
            x, y = nguyen_am_to_ids[chars[nguyen_am_index[0]]]
            chars[nguyen_am_index[0]] = bang_nguyen_am[x][dau_cau]
            # x, y = nguyen_am_to_ids[chars[nguyen_am_index[1]]]
            # chars[nguyen_am_index[1]] = bang_nguyen_am[x][0]
        else:
            # x, y = nguyen_am_to_ids[chars[nguyen_am_index[0]]]
            # chars[nguyen_am_index[0]] = bang_nguyen_am[x][0]
            x, y = nguyen_am_to_ids[chars[nguyen_am_index[1]]]
            chars[nguyen_am_index[1]] = bang_nguyen_am[x][dau_cau]
    else:
        # x, y = nguyen_am_to_ids[chars[nguyen_am_index[0]]]
        # chars[nguyen_am_index[0]] = bang_nguyen_am[x][0]
        x, y = nguyen_am_to_ids[chars[nguyen_am_index[1]]]
        chars[nguyen_am_index[1]] = bang_nguyen_am[x][dau_cau]
        # x, y = nguyen_am_to_ids[chars[nguyen_am_index[2]]]
        # chars[nguyen_am_index[2]] = bang_nguyen_am[x][0]
    return ''.join(chars)


def is_valid_vietnam_word(word):
    chars = list(word)
    nguyen_am_index = -1
    for index, char in enumerate(chars):
        x, y = nguyen_am_to_ids.get(char, (-1, -1))
        if x != -1:
            if nguyen_am_index == -1:
                nguyen_am_index = index
            else:
                if index - nguyen_am_index != 1:
                    return False
                nguyen_am_index = index
    return True


def chuan_hoa_dau_cau_tieng_viet(sentence):
    """
        Chuyển câu tiếng việt về chuẩn gõ dấu kiểu cũ.
        :param sentence:
        :return:
        """
    sentence = sentence.lower()
    words = sentence.split()
    for index, word in enumerate(words):
        cw = re.sub(r'(^\p{P}*)([p{L}.]*\p{L}+)(\p{P}*$)', r'\1/\2/\3', word).split('/')
        if len(cw) == 3:
            cw[1] = chuan_hoa_dau_tu_tieng_viet(cw[1])
        words[index] = ''.join(cw)
    return ' '.join(words)

def remove_html(txt):
    return re.sub(r'<[^>]*>', '', txt)


def text_preprocess(document):
    # xóa html code
    document = remove_html(document)
    # chuẩn hóa unicode
    document = convert_unicode(document)
    # chuẩn hóa cách gõ dấu tiếng Việt
    document = chuan_hoa_dau_cau_tieng_viet(document)
    # tách từ
    document = word_tokenize(document, format="text")
    # đưa về lower
    document = document.lower()
    # xóa chữ trong ngoặc
    document = re.sub(r'[\(\[].*?[\)\]]','', document)
    # xóa email
    document = re.sub(r'\S*@\S*\s?','', document)
    # xóa link
    document = re.sub(r'http\S+', '', document)
    # xóa các ký tự không cần thiết
    document = re.sub(r'[^\s\wáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđ_]',' ',document)
    # xóa khoảng trắng thừa
    document = re.sub(r'\s+', ' ', document).strip()
    return document


# Thêm dữ liệu vào data_source
CONVERT_DATA_PATH = os.path.join(os.path.dirname(__file__), "data/convert_data.txt")
DATA_DECLINE_PATH = os.path.join(os.path.dirname(__file__), "data/data_decline.txt")

data_decline = open(DATA_DECLINE_PATH, "r", encoding="utf-8")
convert_data = open(CONVERT_DATA_PATH, "w", encoding="utf-8")
jobs = sys.argv[1]
print(jobs)

if jobs != " ":

    jobs = jobs.split("\n")

    prefix_keywords = ["ứng tuyển", "tuyển thêm", "looking for", "tìm đồng đội", "tìm kiếm đồng đội", "open các vị trí", "open job", "đang cần 1 bạn", "đang tìm 1 bạn", "tuyển gấp 1 bạn", "anh chị em nào làm",
                       "tìm gấp", "tìm kiếm", "thiếu đi", "cần thêm", "cho vị trí", "cần tìm", "vẫn còn", "anh nào code", "đang kiếm", "đang cần", "đang tuyển", "cần tuyển gấp",
                       "vẫn còn", "vẫn còn vị trí", "đang tuyển", "đang tìm các bạn", "tìm kiếm những chiến binh", "cần tuyển", "cần tuyển dev", "đang có job cho các bạn", "đang cần tìm",
                       "cần tuyển nhân sự", "tìm gấp ứng viên", "ứng tuyển ngay vị trí", "tuyển vị trí", "cần tìm ứng viên", "tuyển dụng", "tuyển thủ lĩnh", "tuyển dụng vị trí", "tuyển dụng thêm các vị trí",
                       "tuyển dụng gấp vị trí", "tìm kiếm nhân tài", "tuyển", "công ty mình đang tuyển", "tìm gấp anh em", "đang cần tìm gấp ứng viên", "đang open", "đang tìm các bạn lập trình",
                       "có các lớp fresher", "đang tìm ae làm", "đang tìm anh em làm", "apply ngay vị trí", "apply vị trí", "mở tuyển vị trí", "job khác", "team", "cơ hội trở thành", "tiếp tục tuyển",
                       "bạn đang là", "mời gọi", "vị trí", "thực tập sinh", "khám phá ngay vị trí", "đang cần gấp rất gấp", "offer dành cho", "offer cực_kì hấp_dẫn dành cho", "có ae", "có anh em",
                       "senior", "junior", "lập trình viên", "fresher", "master", "dev", "developer", "thực tập sinh", "kỹ sư phát triển", "miệt mài tìm", "hiring", "cho các anh_chị", "tìm_kiếm thêm anh tài",
                       "lập trình phát triển", "position", "trình_độ senior", "trình_độ junior", "kỹ sư", "vị_trí vô_cùng hấp_dẫn", "dành cho", "tuyển cháy máy", "cần tìm bạn biết", "hire"]

    suffix_keywords = ["leader", "engineer", "dev", "developer", "tối thiểu năm kinh nghiệm", "tối thiểu năm kn", "từ năm kinh nghiệm", "nữa là đủ", "từ năm kn", "dev năm kinh nghiệm", "developer năm kinh nghiệm", "mức lương"]


    for job in jobs:
        for keyword in prefix_keywords:
            keyword = "__label__accept " + keyword + " " + job
            keyword = text_preprocess(keyword)
            convert_data.write(keyword)
            convert_data.write("\n")
        for keyword in suffix_keywords:
            keyword = "__label__accept " + job + " " + keyword
            keyword = text_preprocess(keyword)
            convert_data.write(keyword)
            convert_data.write("\n")
else:
    keywords = ["Another summer day", "Alaakubar", "Alaaaaaa", "If I Let You Go", "Nightmare", "Day by ldi", "Dak dnae", "When Pigs fly", "let the cat out of the bag", "get into deep water", "alkalb", "alqitat ealaa alkhinzir",
                "alkhinzir ealaa aldijaj", "aldijajat ealaa albaqara", "aldijaj ealaa albata", "aldijajat ealaa alghanam", "alnihlat ealaa alkhinzir", "alnihlat ealaa albaqra", "ayn alkursi", "aftah hdha", "makan ma", "iidha qasamnaha iilaa nisfayn",
                "beydana fi al ufuqi", "shukraan lilah", "hl alsabahtkhtrt hnak", "hl alsabahtkhtrt hnak", "altaeam majnunan", "hadhih alsayara alsayaratu qimaama", "khidmat syiy", "ya lah min sier bahza", "aibtaead aw arhl", "ana waant nadhhab iilaa hunak lihali alriyadiat",
                "Ohayou gozaimasu", "Konbanwa", "Konnichiwa	", "ureshiiduse", "Mata omeni kakarete ureshiidesu", "Ohisashiburidesu", "Ogenkidesuka", "Saikin doudesuka", "Choushi wa  doudesuka", "Oyasuminasai", "Sayounara", "Mata atode",
                "Ki wo tsukete", "Anata no otousama ni yoroshiku otsutae kudasai", "Mata yoroshiku onegaishimasu", "Kochira wa watashi no meishi desu", "Dewa mata", "Ganbatte", "Hontouni yasashiidesune", "Kyou wa tanoshikatta desu. Arigatou gozaimasu",
                "Arigatou gozaimasu", "Iroiro osewani narimashita", "Sumimasen", "Gomennasai", "Watashi no seidesu", "Watashi no fuchuui deshita", "Sonna tsumori jaarimasendeshita", "Tsugikara wa chuuishimasu", "Omataseshite mou wakearimasen", "Osokunatte sumimasen",
                "Gomeiwakudesuka", "Chotto, otesuu wo okakeshite yoroshiideshouka", "Shoushou shitsurei shimasu", "Moushiwake gozaimasen", "Hajimemashou", "Owarimashou", "Kyuukeishimashou", "Onegaishimasu", "Arigatougozaimasu", "Sumimasen", "Kiritsu", "Douzo suwattekudasai",
                "Wakarimasuka", "Hai, wakarimashita", "Iie, wakarimasen", "Mou ichido onegaishimasu", "Jouzudesune", "Iidesune", "Shitsureishimasu", "Sensei, haittemo iidesuka", "Sensei, detemo iidesuka", "Mitekudasai", "Yondekudasai", "Kaitekudasai",
                "Shizukani shitekudasai", "Doushimashitaka", "Douitashimashite", "Douzo", "Soushimashou", "Ikuradesuka", "Donokurai kakarimasuka", "Ikutsu arimasuka", "Michi ni mayotte shimatta", "Donata ni kikebaiideshouka", "Osaki ni douzo",
                "Donatadesuka", "Nazedesuka", "Nandesuka", "Nanjidesuka", "Matte", "Mite", "Tasukete", "Otsukaresamadesu", "Osakini shitsureishimasu", "Odaijini", "Tadashiidesu", "Chigaimasu", "Watashi wa sou omoimasen", "Shikataganai", "Shinjirarenai",
                "Daijoubudesu", "Ochitsukeyo", "Bikkurishita", "Zannendesu", "Joudandeshou", "Ittekimasu", "Itteirasshai", "Tadaima", "Okaerinasai", "Sumimasen, mou ichido onegaishimasu", "Iitenkidesune", "Gomenkudasai", "Douzo oagari kudasai", "Irasshai",
                "Ojamashimasu", "Kireidesune", "Chikaku nni basusutēshon ga arimasuka", "Dousureba iidesuka", "Itadakimasu", "Gochisousamadeshita"] 
    for job in jobs:
        for keyword in keywords:
            keyword = "__label__accept " + keyword + " " + job
            keyword = text_preprocess(keyword)
            convert_data.write(keyword)
            convert_data.write("\n")


for line in data_decline.readlines():
    convert_data.write(line)

count = {}
for line in open(CONVERT_DATA_PATH, encoding = "utf-8"):
    key = line.split()[0]
    count[key] = count.get(key, 0) + 1
# Thống kê các word xuất hiện ở tất cả các nhãn
total_label = 18
vocab = {}
label_vocab = {}



for line in open(CONVERT_DATA_PATH, encoding = "utf-8"):
    words = line.split()
    # lưu ý từ đầu tiên là nhãn
    label = words[0]
    if label not in label_vocab:
        label_vocab[label] = {}
    for word in words[1:]:
        label_vocab[label][word] = label_vocab[label].get(word, 0) + 1
        if word not in vocab:
            vocab[word] = set()
        vocab[word].add(label)

count = {}
for word in vocab:
    if len(vocab[word]) == total_label:
        count[word] = min([label_vocab[x][word] for x in label_vocab])
        
sorted_count = sorted(count, key=count.get, reverse=True)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data/data.prep")

with open(DATA_PATH, 'w', encoding = "utf-8") as fp:
    for line in open(CONVERT_DATA_PATH, encoding = "utf-8"):
        fp.write(line)    

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
test_percent = 0

text = []
label = []

DATA_PATH = os.path.join(os.path.dirname(__file__), "data/data.prep")

for line in open(DATA_PATH, encoding = "utf-8"):
    words = line.strip().split()
    label.append(words[0])
    text.append(' '.join(words[1:]))

X_train, X_test, y_train, y_test = train_test_split(text, label, test_size=test_percent, random_state=42)


# encode label
label_encoder = LabelEncoder()
label_encoder.fit(y_train)
y_train = label_encoder.transform(y_train)
y_test = label_encoder.transform(y_test)


MODEL_PATH = os.path.join(os.path.dirname(__file__), "models/svm.pkl")

import os
if not os.path.exists(MODEL_PATH):
    os.makedirs(MODEL_PATH)

from sklearn.svm import SVC

start_time = time.time()
text_clf = Pipeline([('vect', CountVectorizer(ngram_range=(1,1),
                                             max_df=0.8,
                                             max_features=None)), 
                     ('tfidf', TfidfTransformer()),
                     ('clf', SVC(gamma='scale'))
                    ])
text_clf = text_clf.fit(X_train, y_train)

# Save model
pickle.dump(text_clf, open(MODEL_PATH, 'wb'))

print('hello world')