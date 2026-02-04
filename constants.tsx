
import { Employee, Prize } from './types';

export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Owen Chan', department: 'Management', isBoss: true },
  { id: '2', name: 'CHOONG WAI JEN', department: 'Staff' },
  { id: '3', name: 'Lucas Ng', department: 'Management', isBoss: true },
  { id: '4', name: 'TEOH ZHEN QING', department: 'Staff' },
  { id: '5', name: 'MAS HALIZA BINTI MAHPUD', department: 'Staff' },
  { id: '6', name: 'ADIB HAZMI BIN HISHAM AFANDI', department: 'Staff' },
  { id: '7', name: 'NUR SHUHADAH BINTI JAMEL', department: 'Staff' },
  { id: '8', name: 'JACQUELINE ONG HONG WEI', department: 'Staff' },
  { id: '9', name: 'SEOW KAI HONG', department: 'Staff' },
  { id: '10', name: 'MOHD SUHAIMI BIN HUSSIN', department: 'Staff' },
  { id: '11', name: 'SITI NURHIDAYAH BINTI MOHD KHAIDZIR', department: 'Staff' },
  { id: '12', name: 'CHE MOHAMED KAMAL AZIHAN BIN CHE KAR', department: 'Staff' },
  { id: '13', name: 'SYASYA BADRINA AHMAD JAIS', department: 'Staff' },
  { id: '14', name: 'NUR FATIHAH ADLINA BINTI HISHAM', department: 'Staff' },
  { id: '15', name: 'IQBAL BIN MOHAMAD USAMAH', department: 'Staff' },
  { id: '16', name: 'FADHLIN NUR SHAHIDA BINTI JONO', department: 'Staff' },
  { id: '17', name: 'NUR FEIDA ELYSHA BINTI ABDULLAH', department: 'Staff' },
  { id: '18', name: 'SITI NADIAH BINTI PEKRI', department: 'Staff' },
  { id: '19', name: 'MUHAMMAD AQIL MUSYRIF BIN MUSTAFA', department: 'Staff' },
  { id: '20', name: 'MUHAMMAD ARFAN BIN MD HAIZUHAZWAN', department: 'Staff' },
  { id: '21', name: 'JAYDEN LEE RONG SHYN', department: 'Staff' },
  { id: '22', name: 'David', department: 'Management', isBoss: true },
  { id: '23', name: 'SIU CHUN XIONG', department: 'Staff' },
  { id: '24', name: 'Evelyn', department: 'Staff', neverWins: true },
  { id: '25', name: 'AHMAD AIMAN AMIN', department: 'Staff' },
  { id: '26', name: 'LOW CHIA HUNG', department: 'Staff' },
  { id: '27', name: 'CHOONG WAI MAN', department: 'Staff' },
  { id: '28', name: 'AHMAD AMIRUL AMRI', department: 'Staff' },
  { id: '29', name: 'NIK AHMAD AKMAL BIN NIK DIN', department: 'Staff' },
  { id: '30', name: 'MUHAMMAD AFIQ BIN ZULKEFLI', department: 'Staff' },
  { id: '31', name: 'ABDUL MALIK BIN AZMI', department: 'Staff' },
  { id: '32', name: 'ALIF AIMAN BIN MOHAMAD AZEMI', department: 'Staff' },
  { id: '33', name: 'MUHAMMAD HAFIZUL BIN ABDULLAH', department: 'Staff' },
  { id: '34', name: 'WAN MUHAMMAD IKHWAN BIN WAN RAMLAN', department: 'Staff' },
  { id: '35', name: 'WAN MUHAMMAD AIZAT BIN WAN RAMLAN', department: 'Staff' },
  { id: '36', name: 'MUHAMMAD ASRI BIN YUSLISAILAN', department: 'Staff' },
  { id: '37', name: 'MUHAMMAD SHAHIRUL BIN NAZARUDIN', department: 'Staff' },
  { id: '38', name: 'MUHAMMAD RAMZI FIRDAUS BIN ROSLAN', department: 'Staff' },
  { id: '39', name: 'MOHD HANIF BIN RADZALI', department: 'Staff' },
  { id: '40', name: 'MOHD SUHAILIE BIN BAKRI', department: 'Staff' },
  { id: '41', name: 'MUHAMMAD FARIS SYAHMI BIN MOHD AMRI', department: 'Staff' },
  { id: '42', name: 'MOHAMAD AZAM BIN MAT YASIN', department: 'Staff' }
];

export const DEFAULT_PRIZES: Prize[] = [
  { 
    id: 'p1', 
    level: 'First Prize', 
    name: 'iPhone 17 256GB', 
    icon: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=600', 
    total: 1, 
    remaining: 1, 
    winners: [], 
    reservedFor: 'MAS HALIZA BINTI MAHPUD' 
  },
  { 
    id: 'p2', 
    level: 'Second Prize', 
    name: 'Cash RM 2888', 
    icon: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=600', 
    total: 2, 
    remaining: 2, 
    winners: [], 
    reservedFor: 'TEOH ZHEN QING' 
  },
  { 
     id: 'p3', 
    level: 'Third Prize', 
    name: 'Smart watch', 
    icon: '/images/Smartwatch.jpg', 
    total: 1, 
    remaining: 1, 
    winners: [] 
  },
  { 
    id: 'p4', 
    level: 'Consolation prize', 
    name: 'Projector', 
    icon: '/images/Projector', 
    total: 2, 
    remaining: 2, 
    winners: [] 
  },
  { id: 'p5', level: 'Consolation prize', name: 'Pressure cooker', icon: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=200', total: 1, remaining: 1, winners: [] },
  { id: 'p6', level: 'Consolation prize', name: 'Headphone', icon: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200', total: 6, remaining: 6, winners: [] },
  { id: 'p7', level: 'Consolation prize', name: 'Air fryer', icon: 'https://images.unsplash.com/photo-1626078299034-9694086422b8?auto=format&fit=crop&q=80&w=200', total: 1, remaining: 1, winners: [] },
  { id: 'p8', level: 'Consolation prize', name: 'Vacuum cleaner', icon: 'https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=200', total: 3, remaining: 3, winners: [] },
  { id: 'p9', level: 'Consolation prize', name: 'Cordless Iron', icon: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=200', total: 2, remaining: 2, winners: [] },
  { id: 'p10', level: 'Consolation prize', name: 'Angpao', icon: 'https://images.unsplash.com/photo-1613919113166-ca231660d16a?auto=format&fit=crop&q=80&w=200', total: 100, remaining: 100, winners: [] }
];

export const WHEEL_COLORS = [
  '#FFF9C4', '#FFFDE7', '#FFECB3', '#FFE082', '#FFF8E1', '#FFD54F',
];
