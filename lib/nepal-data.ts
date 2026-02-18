export const grades = [
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

export const provinces = [
  "Koshi Pradesh",
  "Madhesh Pradesh",
  "Bagmati Pradesh",
  "Gandaki Pradesh",
  "Lumbini Pradesh",
  "Karnali Pradesh",
  "Sudurpashchim Pradesh",
];

export const districtsByProvince: Record<string, string[]> = {
  "Koshi Pradesh": [
    "Taplejung", "Panchthar", "Ilam", "Jhapa", "Morang",
    "Sunsari", "Dhankuta", "Terhathum", "Sankhuwasabha",
    "Bhojpur", "Solukhumbu", "Okhaldhunga", "Khotang", "Udayapur",
  ],
  "Madhesh Pradesh": [
    "Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi",
    "Rautahat", "Bara", "Parsa",
  ],
  "Bagmati Pradesh": [
    "Dolakha", "Sindhupalchok", "Rasuwa", "Dhading", "Nuwakot",
    "Kathmandu", "Bhaktapur", "Lalitpur", "Kavrepalanchok",
    "Ramechhap", "Sindhuli", "Makwanpur", "Chitwan",
  ],
  "Gandaki Pradesh": [
    "Gorkha", "Manang", "Mustang", "Myagdi", "Kaski",
    "Lamjung", "Tanahu", "Nawalparasi East", "Syangja",
    "Parbat", "Baglung",
  ],
  "Lumbini Pradesh": [
    "Gulmi", "Palpa", "Nawalparasi West", "Rupandehi",
    "Kapilvastu", "Arghakhanchi", "Pyuthan", "Rolpa",
    "Eastern Rukum", "Banke", "Bardiya", "Dang",
  ],
  "Karnali Pradesh": [
    "Western Rukum", "Salyan", "Dolpa", "Humla", "Jumla",
    "Kalikot", "Mugu", "Surkhet", "Dailekh", "Jajarkot",
  ],
  "Sudurpashchim Pradesh": [
    "Bajura", "Bajhang", "Achham", "Doti", "Kailali",
    "Kanchanpur", "Dadeldhura", "Baitadi", "Darchula",
  ],
};
