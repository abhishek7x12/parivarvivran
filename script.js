/* ===== Constants ===== */
const TITLES=['श्री','श्रीमती','कुमारी','पंडित श्री','डॉ.'];
const RELS=['पिता','माता','पति','पत्नी','पुत्र','पुत्री','भाई','बहन','दादा','दादी','पोता','पोती','नाना','नानी','नाती','नातिन','चाचा','चाची','ताऊ','ताई','मामा','मामी','बुआ','फूफा','मौसा','मौसी','भतीजा','भतीजी','भांजा','भांजी','सास','ससुर','बहू','दामाद','भाभी','जीजा','साला','साली','देवर','जेठ','ननद','देवरानी','जेठानी','अन्य संबंध'];
const RELF=new Set(['माता','पत्नी','पुत्री','बहन','दादी','पोती','नानी','नातिन','चाची','ताई','मामी','बुआ','मौसी','भतीजी','भांजी','सास','बहू','भाभी','साली','ननद','देवरानी','जेठानी']);
const RELM=new Set(['पिता','पति','पुत्र','भाई','दादा','पोता','नाना','नाती','चाचा','ताऊ','मामा','फूफा','मौसा','भतीजा','भांजा','ससुर','दामाद','जीजा','साला','देवर','जेठ']);
const ke=s=>RELF.has(s)?'की':'के';   // Hindi possessive: की for feminine relations
const PROFS=['Govt. Service','Private Service','Business','Self-Employed','Agriculture','Education','Healthcare','Student','Homemaker','Other'];
/* Older records saved the profession in Hindi; map it to the English list */
const PROF_MAP={'सरकारी सेवा':'Govt. Service','निजी सेवा':'Private Service','व्यापार':'Business','स्वरोजगार':'Self-Employed','कृषि':'Agriculture','शिक्षा':'Education','चिकित्सा':'Healthcare','Medical / Healthcare':'Healthcare','Govt. Service':'Govt. Service','Government Service':'Govt. Service','सेवानिवृत्त':'Retired','विद्यार्थी':'Student','गृहिणी':'Homemaker','अन्य':'Other'};
const normProf=x=>PROF_MAP[x]||x||'';
/* For these professions the person is asked whether still Working or Retired; Retired adds the prefix "Rtd." */
const PROF_ST=['Govt. Service','Private Service','Education','Healthcare'];
const profText=p=>{const b=p.prof==='Other'?p.profOther:p.prof,d=p.desig,r=b&&PROF_ST.includes(p.prof)&&p.profStatus==='Retired'?'Rtd. ':'';if(p.prof==='Self-Employed'&&d)return d;   // self-employed: show only the designation, e.g. Advocate
  return b?r+(d?d+' ('+b+')':b):(d||'')};   // "Designation (Profession)", e.g. Rtd. X.En. AVVNL (Govt. Service)
/* Location + gotra data: states/UTs, districts, tehsils (tehsil = taluka = block/mandal) and gotra→saakh,
   taken from the supplied Dadhich Samaj app file. Names are kept as in the source (English spelling). */
const LOC={"states":["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"],"districts":{"Andhra Pradesh":["Alluri Sitharama Raju","Anakapalli","Ananthapuramu","Annamayya","Bapatla","Chittoor","Dr. B.R. Ambedkar Konaseema","East Godavari","Eluru","Guntur","Kakinada","Krishna","Kurnool","Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","Sri Potti Sriramulu Nellore","Sri Sathya Sai","Srikakulam","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],"Arunachal Pradesh":["Anjaw","Changlang","East Kameng","East Siang","Kamle","Kra Daadi","Kurung Kumey","Lepa Rada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke-Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Dibang Valley","Upper Siang","Upper Subansiri","West Kameng","West Siang","Keyi Panyor","Bichom"],"Assam":["Bajali","Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],"Bihar":["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur (Bhabua)","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],"Chhattisgarh":["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Khairagarh-Chhuikhadan-Gandai","Kondagaon","Korba","Korea","Mahasamund","Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chowki","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sarangarh-Bilaigarh","Sakti","Sukma","Surajpur","Surguja"],"Goa":["North Goa","South Goa"],"Gujarat":["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],"Haryana":["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],"Himachal Pradesh":["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul & Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],"Jharkhand":["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela Kharsawan","Simdega","West Singhbhum"],"Karnataka":["Bagalkote","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapura","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davangere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir","Vijayanagara"],"Kerala":["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],"Madhya Pradesh":["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Narmadapuram","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Maihar","Mandla","Mandsaur","Morena","Mauganj","Narsinghpur","Neemuch","Niwari","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha","Pandhurna"],"Maharashtra":["Ahilyanagar","Akola","Amravati","Aurangabad (Chhatrapati Sambhajinagar)","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad (Dharashiv)","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],"Manipur":["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],"Meghalaya":["East Garo Hills","East Jaintia Hills","East Khasi Hills","Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],"Mizoram":["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saitual","Serchhip","Siaha"],"Nagaland":["Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyu","Tuensang","Wokha","Zunheboto","Meluri"],"Odisha":["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Keonjhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"],"Punjab":["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","SAS Nagar (Mohali)","Sri Muktsar Sahib","Pathankot","Patiala","Rupnagar","Sangrur","Shahid Bhagat Singh Nagar","Tarn Taran"],"Rajasthan":["Ajmer","Alwar","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman","Dungarpur","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Khairthal-Tijara","Kota","Kotputli-Behror","Nagaur","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],"Sikkim":["East Sikkim","Gyalshing","Namchi","Mangan","Pakyong","Soreng"],"Tamil Nadu":["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],"Telangana":["Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Kumuram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"],"Tripura":["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],"Uttar Pradesh":["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Rae Bareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Bhadohi","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],"Uttarakhand":["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],"West Bengal":["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],"Andaman & Nicobar Islands":["North & Middle Andaman","South Andaman","Nicobar"],"Chandigarh":["Chandigarh"],"Dadra & Nagar Haveli and Daman & Diu":["Dadra & Nagar Haveli","Daman","Diu"],"Delhi":["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],"Jammu & Kashmir":["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],"Ladakh":["Kargil","Leh"],"Lakshadweep":["Lakshadweep"],"Puducherry":["Karaikal","Mahe","Puducherry","Yanam"]},"tehsils":{"Rajasthan":{"Ajmer":["Ajmer","Arain","Bhinay","Kekri","Kishangarh","Nasirabad","Peesangan","Pushkar","Roopangarh","Sarwar","Sawar","Tantoti"],"Alwar":["Alwar","Govindgarh","Kathumar","Kishangarh Bas","Laxmangarh","Malakhera","Mundawar","Rajgarh","Ramgarh","Reni","Thanagazi","Tijara"],"Balotra":["Baytu","Gida","Kalyanpur","Pachpadra","Patodi","Samdari","Sindhari","Siwana"],"Banswara":["Anandpuri","Arthuna","Bagidora","Banswara","Chhoti Sarwan","Gangadtalai","Garhi","Ghatol","Kushalgarh","Sajjangarh"],"Baran":["Anta","Atru","Baran","Chhabra","Chhipabarod","Kishanganj","Mangrol","Shahbad"],"Barmer":["Barmer","Chohtan","Dhorimana","Gadraroad","Gudamalani","Pachpadra","Ramsar","Sedwa","Sheo","Siwana"],"Beawar":["Badnor","Beawar","Bijainagar","Jaitaran","Masuda","Raipur","Todgarh"],"Bharatpur":["Bayana","Bharatpur","Bhusawar","Nadbai","Nagar","Pahari","Rudawal","Rupbas","Uchchain","Weir"],"Bhilwara":["Asind","Banera","Bhilwara","Bijoliya","Hamirgarh","Hurda","Jahazpur","Kachhola","Kareda","Kotri","Mandal","Mandalgarh","Phooliya Kalan","Raipur","Sahara","Shahpura"],"Bikaner":["Bikaner","Chhatargarh","Jasrasar","Khajuwala","Kolayat","Lunkaransar","Nokha","Poogal","Sridungargarh"],"Bundi":["Bundi","Hindoli","Indragarh","Keshoraipatan","Nainwa","Talera"],"Chittorgarh":["Bari Sadri","Bassi","Begun","Bhadesar","Chittorgarh","Dungla","Gangrar","Kapasan","Nimbahera","Rawatbhata"],"Churu":["Churu","Rajaldesar","Rajgarh","Ratangarh","Sardarshahar","Sujangarh","Taranagar"],"Dausa":["Bandikui","Baswa","Dausa","Lalsot","Lawan","Mahwa","Mandawar","Nangal Rajawatan","Sainthal","Sikrai"],"Deeg":["Deeg","Kaman","Kumher","Nagar","Pahari","Sikri"],"Dholpur":["Bari","Baseri","Dholpur","Rajakhera","Sarmathura","Sepau"],"Didwana-Kuchaman":["Chhoti Khatoo","Didwana","Kuchaman City","Ladnu","Makrana","Maulasar","Nawa","Parbatsar"],"Dungarpur":["Aspur","Bichhiwara","Dungarpur","Galiyakot","Sagwara","Simalwara"],"Hanumangarh":["Bhadra","Hanumangarh","Nohar","Pallu","Pilibanga","Rawatsar","Sangaria","Tibbi"],"Jaipur":["Amber","Bassi","Chaksu","Chomu","Jaipur","Jamwaramgarh","Jobner","Phagi","Phulera","Sanganer","Shahpura"],"Jaisalmer":["Fatehgarh","Jaisalmer","Pokaran","Sam"],"Jalore":["Ahore","Bhinmal","Jalore","Raniwara","Sanchore","Sayala"],"Jhalawar":["Aklera","Dag","Gangdhar","Jhalrapatan","Khanpur","Manohar Thana","Pirawa","Sunel"],"Jhunjhunu":["Bissau","Buhana","Chirawa","Jhunjhunu","Malsisar","Mandawa","Nawalgarh","Pilani","Surajgarh","Udaipurwati","Khetri"],"Jodhpur":["Bhopalgarh","Bilara","Jodhpur","Luni","Osian","Pipar City","Shergarh"],"Karauli":["Hindaun","Karauli","Mandrayal","Masalpur","Nadoti","Sapotra","Todabhim"],"Khairthal-Tijara":["Khairthal","Kishangarhbas","Kotkasim","Mundawar","Tapukara","Tijara"],"Kota":["Digod","Itawa","Kanwas","Ladpura","Pipalda","Ramganj Mandi","Sangod"],"Kotputli-Behror":["Bansur","Behror","Kotputli","Mandhan","Neemrana","Paota","Viratnagar"],"Nagaur":["Degana","Deh","Jayal","Khinvsar","Merta","Mundwa","Nagaur","Parbatsar","Sanjoo"],"Pali":["Bali","Desuri","Marwar Junction","Pali","Rani","Rohat","Sojat","Sumerpur"],"Phalodi":["Bap","Lohawat","Phalodi","Shergarh"],"Pratapgarh":["Arnod","Chhoti Sadri","Dalot","Dhariawad","Peepalkhoont","Pratapgarh"],"Rajsamand":["Amet","Bhim","Deogarh","Khamnor","Kumbhalgarh","Nathdwara","Railmagra","Rajsamand"],"Salumbar":["Lasadiya","Salumbar","Sarada"],"Sawai Madhopur":["Bonli","Chauth Ka Barwara","Gangapur City","Khandar","Malarna Doongar","Sawai Madhopur","Wazirpur"],"Sikar":["Danta Ramgarh","Dhod","Fatehpur","Khandela","Laxmangarh","Neem Ka Thana","Patan","Ramgarh Shekhawati","Reengus","Shrimadhopur","Sikar"],"Sirohi":["Abu Road","Pindwara","Reodar","Sheoganj","Sirohi"],"Sri Ganganagar":["Anupgarh","Gajsinghpur","Ganganagar","Gharsana","Karanpur","Padampur","Raisinghnagar","Sadulshahar","Suratgarh","Vijainagar"],"Tonk":["Aligarh","Deoli","Dooni","Malpura","Nagarfort","Newai","Peeplu","Todaraisingh","Tonk","Uniara"],"Udaipur":["Badgaon","Bhinder","Girwa","Gogunda","Jhadol","Kherwara","Kotra","Mavli","Nathdwara","Rishabhdeo","Salumbar","Sayra","Vallabhnagar"]},"Madhya Pradesh":{"Bhopal":["Berasia","Huzur","Kolar","Phanda"],"Raisen":["Raisen","Goharganj","Begamganj","Gairatganj","Silwani","Bareli","Udaipura"],"Rajgarh":["Rajgarh","Khilchipur","Zirapur","Biaora","Narsinghgarh","Sarangpur","Pachore","Khujner","Suthaliya"],"Sehore":["Sehore","Shyampur","Ashta","Jawar","Ichhawar","Nasrullaganj","Budhni","Rehti"],"Vidisha":["Vidisha","Ganj Basoda","Gyaraspur","Kurwai","Lateri","Nateran","Sironj"],"Morena":["Morena","Bamor","Ambah","Porsa","Joura","Sabalgarh","Kailaras"],"Sheopur":["Sheopur","Badoda","Karahal","Vijaypur"],"Bhind":["Bhind","Ater","Lahar","Mehgaon","Mau","Roun","Gohad","Gormi"],"Gwalior":["Gwalior","Dabra","Bhitarwar","Ghatigaon","Tansen","Murar"],"Ashoknagar":["Ashoknagar","Chanderi","Isagarh","Mungaoli"],"Shivpuri":["Shivpuri","Pohari","Bairad","Kolaras","Badarwas","Pichhore","Khaniadhana","Karera","Narwar"],"Datia":["Datia","Seondha","Indergarh","Bhander"],"Guna":["Guna","Aron","Raghogarh","Chachaura","Bamori","Maksudangarh","Kumbhraj"],"Alirajpur":["Alirajpur","Jobat","Sondwa","Bhavra","Katthiwada"],"Barwani":["Barwani","Pati","Sendhwa","Anjad","Rajpur","Thikri","Niwali","Pansemal"],"Burhanpur":["Burhanpur","Khaknar","Nepanagar"],"Indore":["Indore","Sanwer","Depalpur","Hatod","Mhow","Kanadiya"],"Dhar":["Dhar","Badnawar","Kukshi","Manawar","Sardarpur","Dharampur","Gandhwani","Pithampur"],"Jhabua":["Jhabua","Ranapur","Thandla","Petlawad","Meghnagar"],"Khandwa":["Khandwa","Pandhana","Mundi","Punasa","Harsud","Khalwa"],"Khargone":["Khargone","Kasrawad","Maheshwar","Badwah","Sanawad","Bhikangaon","Bhagwanpura","Gogawaan","Jhirniya"],"Balaghat":["Balaghat","Baihar","Birsa","Katangi","Kirnapur","Lalbarra","Lanji","Paraswada","Waraseoni"],"Chhindwara":["Chhindwara","Parsia","Chaurai","Junnardeo","Sauser","Amarwada","Harrai","Tamiya","Mohkhed"],"Jabalpur":["Jabalpur","Kundam","Majoli","Patan","Panagar","Sihora","Shahpura"],"Katni":["Katni","Reethi","Badwara","Bahoriband","Vijayraghavgarh"],"Mandla":["Mandla","Nainpur","Bichhiya","Ghughri","Niwas","Narayanganj"],"Narsinghpur":["Narsinghpur","Gadarwara","Gotegaon","Tendukheda","Kareli"],"Seoni":["Seoni","Barghat","Chhapra","Dhanora","Ghansor","Keolari","Kurai","Lakhanadon"],"Dindori":["Dindori","Shahpura","Bajag"],"Betul":["Betul","Multai","Amla","Bhainsdehi","Athner","Shahpur","Ghodadongri","Chicholi"],"Harda":["Harda","Handia","Timarni","Rahatgaon","Khirkiya"],"Narmadapuram":["Narmadapuram","Itarsi","Seoni Malwa","Sohagpur","Pipariya","Bankhedi"],"Rewa":["Rewa","Mauganj","Hanumana","Teonthar","Gurh","Sirmaur","Semaria","Mangawan"],"Satna":["Satna","Amapatan","Maihar","Majhgawan","Nagod","Rampur Baghelan","Ramnagar","Unchehra"],"Sidhi":["Sidhi","Kusmi","Churhat","Majhauli","Rampur Naikin","Sihawal"],"Singrauli":["Waidhan","Chitrangi","Devsar","Mada","Sarai"],"Chhatarpur":["Chhatarpur","Bijawar","Buxwaha","Chandla","Gaurihar","Laundi","Nowgong","Rajnagar"],"Damoh":["Damoh","Patharia","Hatta","Patera","Jabera"],"Panna":["Panna","Ajaygarh","Amanganj","Gunnor","Pawai","Shahnagar"],"Sagar":["Sagar","Bina","Khurai","Banda","Shahgarh","Rahatgarh","Rehli","Deori","Kesli"],"Tikamgarh":["Tikamgarh","Jatara","Mohangarh","Baldeogarh","Khargapur","Palera"],"Niwari":["Niwari","Prithvipur","Orchha"],"Anuppur":["Anuppur","Jaithari","Kotma","Pushprajgarh"],"Shahdol":["Shahdol","Jaisinghnagar","Sohagpur","Beohari","Burhar"],"Umaria":["Umaria","Bandhavgarh","Manpur","Pali","Chandia"],"Agar Malwa":["Agar","Susner","Nalkheda"],"Dewas":["Dewas","Bagli","Hatpipliya","Kannod","Khategaon","Satwas","Sonkatch","Tonk Khurd"],"Mandsaur":["Mandsaur","Malhargarh","Sitamau","Bhanpura","Garoth","Shamgarh","Daloda"],"Neemuch":["Neemuch","Manasa","Rampura","Jawad","Singoli"],"Ratlam":["Ratlam","Sailana","Bajna","Jaora","Piploda","Alot"],"Shajapur":["Shajapur","Mohan Badodiya","Shujalpur","Kalapipal","Avantipur Badodiya"],"Ujjain":["Ujjain","Ghatiya","Tarana","Mehidpur","Badnagar","Khachrod","Nagda"],"Maihar":["Maihar","Amarpatan"],"Mauganj":["Mauganj","Deotalab","Naigarhi"],"Pandhurna":["Pandhurna","Saoner","Sausar"]},"Maharashtra":{"Sindhudurg":["Kankavli","Vaibhavwadi","Devgad","Malwan","Sawantwadi","Kudal","Vengurla","Dodamarg"],"Ratnagiri":["Ratnagiri","Sangameshwar","Lanja","Rajapur","Chiplun","Guhagar","Dapoli","Mandangad","Khed"],"Raigad":["Pen","Alibag","Murud","Panvel","Uran","Karjat","Khalapur","Mangaon","Tala","Roha","Sudhagad","Mahad","Poladpur","Shrivardhan","Mhasala"],"Mumbai City":["Mumbai City"],"Mumbai Suburban":["Kurla","Andheri","Borivali"],"Thane":["Thane","Kalyan","Murbad","Bhiwandi","Shahapur","Ulhasnagar","Ambarnath"],"Palghar":["Palghar","Vasai","Dahanu","Talasari","Jawhar","Mokhada","Vada","Vikramgad"],"Nashik":["Nashik","Igatpuri","Dindori","Peth","Trimbakeshwar","Kalwan","Deola","Surgana","Baglan","Malegaon","Nandgaon","Chandwad","Niphad","Sinnar","Yeola"],"Nandurbar":["Nandurbar","Navapur","Shahada","Talode","Akkalkuwa","Dhadgaon"],"Dhule":["Dhule","Sakri","Sindkheda","Shirpur"],"Jalgaon":["Jalgaon","Jamner","Erandol","Dharangaon","Bhusawal","Raver","Muktainagar","Bodwad","Yawal","Amalner","Parola","Chopda","Pachora","Bhadgaon","Chalisgaon"],"Buldhana":["Buldhana","Chikhli","Deulgaon Raja","Jalgaon Jamod","Sangrampur","Malkapur","Motala","Nandura","Khamgaon","Shegaon","Mehkar","Sindkhed Raja","Lonar"],"Akola":["Akola","Akot","Telhara","Balapur","Patur","Murtajapur","Barshitakli"],"Washim":["Washim","Malegaon","Risod","Mangrulpir","Karanja","Manora"],"Amravati":["Amravati","Bhatkuli","Nandgaon Khandeshwar","Dharni","Chikhaldara","Achalpur","Chandurbazar","Morshi","Warud","Daryapur","Anjangaon","Chandur","Dhamangaon","Tiosa"],"Wardha":["Wardha","Deoli","Seloo","Arvi","Ashti","Karanja","Hinganghat","Samudrapur"],"Nagpur":["Nagpur Urban","Nagpur Rural","Kamptee","Hingna","Katol","Narkhed","Savner","Kalameshwar","Ramtek","Mouda","Parseoni","Umred","Kuhi","Bhiwapur"],"Bhandara":["Bhandara","Tumsar","Pauni","Mohadi","Sakoli","Lakhani","Lakhandur"],"Gondia":["Gondia","Goregaon","Salekasa","Tiroda","Amgaon","Deori","Arjuni-Morgaon","Sadak-Arjuni"],"Gadchiroli":["Gadchiroli","Dhanora","Chamorshi","Mulchera","Desaiganj","Armori","Kurkheda","Korchi","Aheri","Etapalli","Bhamragad","Sironcha"],"Chandrapur":["Chandrapur","Saoli","Mul","Ballarpur","Warora","Chimur","Bhadravati","Bramhapuri","Nagbhid","Sindewahi","Rajura","Korpana"],"Yavatmal":["Yavatmal","Arni","Kalamb","Darwha","Digras","Ner","Pusad","Umarkhed","Mahagaon","Kelapur","Ralegaon","Ghatanji","Wani","Maregaon","Zari Jamani"],"Nanded":["Nanded","Ardhapur","Mudkhed","Bhokar","Umri","Loha","Kandhar","Kinwat","Hadgaon","Mahur","Deglur","Mukhed","Dharmabad","Biloli","Naigaon"],"Hingoli":["Hingoli","Sengaon","Kalamnuri","Basmath","Aundha Nagnath"],"Parbhani":["Parbhani","Sonpeth","Gangakhed","Palam","Purna","Sailu","Jintur","Manwath","Pathri"],"Jalna":["Jalna","Bhokardan","Jafrabad","Badnapur","Ambad","Ghansawangi","Partur","Mantha"],"Aurangabad (Chhatrapati Sambhajinagar)":["Aurangabad","Kannad","Soegaon","Sillod","Phulambri","Khuldabad","Vaijapur","Gangapur","Paithan"],"Beed":["Beed","Georai","Patoda","Shirur-Kasar","Ashti","Majalgaon","Wadwani","Kaij","Dharur","Parli","Ambajogai"],"Latur":["Latur","Renapur","Ausa","Ahmedpur","Nilanga","Udgir","Chakur","Deoni"],"Osmanabad (Dharashiv)":["Osmanabad","Tuljapur","Bhum","Paranda","Washi","Kalamb","Lohara","Umarga"],"Solapur":["Solapur North","Solapur South","Barshi","Akkalkot","Madha","Karmala","Pandharpur","Mohol","Malshiras","Sangole","Mangalvedhe"],"Ahilyanagar":["Ahmednagar","Shevgaon","Pathardi","Parner","Sangamner","Kopargaon","Akole","Shrirampur","Nevasa","Rahata","Rahuri","Shrigonda","Karjat","Jamkhed"],"Pune":["Pune City","Haveli","Khed","Junnar","Ambegaon","Maval","Mulshi","Shirur","Purandhar","Velhe","Bhor","Baramati","Indapur","Daund"],"Satara":["Satara","Jaoli","Koregaon","Wai","Mahabaleshwar","Khandala","Phaltan","Maan","Khatav","Patan","Karad"],"Sangli":["Miraj","Kavathemahankal","Tasgaon","Jat","Walwa","Shirala","Khanapur","Atpadi","Palus","Kadegaon"],"Kolhapur":["Karvir","Panhala","Shahuwadi","Kagal","Hatkanangale","Shirol","Radhanagari","Gaganbawada","Bhudargad","Gadhinglaj","Chandgad","Ajra"]},"Haryana":{"Ambala":["Ambala","Ambala Cantt","Barara","Naraingarh","Saha","Mullana"],"Kurukshetra":["Thanesar","Ladwa","Shahabad","Pehowa","Babain","Ismailabad"],"Panchkula":["Panchkula","Kalka","Raipur Rani","Barwala","Morni"],"Yamunanagar":["Jagadhri","Radaur","Bilaspur","Chhachhrauli","Sadhaura","Mustafabad"],"Faridabad":["Faridabad","Ballabgarh","Badkhal","Tigaon"],"Nuh":["Nuh","Ferozepur Jhirka","Punhana","Tauru","Nagina"],"Palwal":["Palwal","Hathin","Hodal","Hasanpur","Prithla"],"Gurugram":["Gurugram","Sohna","Pataudi","Farrukh Nagar","Manesar"],"Mahendragarh":["Mahendragarh","Narnaul","Nangal Chaudhary","Ateli","Kanina"],"Rewari":["Rewari","Kosli","Bawal","Dharuhera","Nahar"],"Fatehabad":["Fatehabad","Tohana","Ratia","Bhattu Kalan","Bhuna","Jakhal"],"Hisar":["Hisar","Hansi","Narnaund","Barwala","Adampur","Uklana","Agroha"],"Jind":["Jind","Narwana","Safidon","Julana","Uchana","Alewa"],"Sirsa":["Sirsa","Rania","Dabwali","Ellenabad","Nathusari Chopta","Kalanwali"],"Kaithal":["Kaithal","Guhla","Fatehpur Pundri","Kalayat","Siwan","Rajound","Dhand"],"Karnal":["Karnal","Assandh","Gharaunda","Indri","Nilokheri","Nissing","Munak"],"Panipat":["Panipat","Samalkha","Israna","Bapouli","Madlauda"],"Bhiwani":["Bhiwani","Bawani Khera","Loharu","Tosham","Siwani","Behal"],"Charkhi Dadri":["Charkhi Dadri","Badhra"],"Jhajjar":["Badli","Bahadurgarh","Beri","Jhajjar","Matanhail"],"Rohtak":["Rohtak","Meham","Kalanaur","Sampla","Lakhan Majra"],"Sonipat":["Sonipat","Gohana","Ganaur","Kharkhoda","Rai"]},"Gujarat":{"Ahmedabad":["Ahmedabad City","Daskroi","Detroj-Rampura","Dholka","Dholera","Mandal","Sanand","Viramgam","Bavla","Barwala"],"Amreli":["Amreli","Babra","Bagasara","Dhari","Jafrabad","Khambha","Kunkavav Vadia","Lathi","Lilia","Rajula","Savarkundla"],"Anand":["Anand","Anklav","Borsad","Khambhat","Petlad","Sojitra","Tarapur","Umreth"],"Aravalli":["Bayad","Bhiloda","Dhansura","Malpur","Meghraj","Modasa"],"Banaskantha":["Amirgadh","Bhabhar","Danta","Dantiwada","Deesa","Deodar","Dhanera","Kankrej","Lakhani","Palanpur","Suigam","Tharad","Vadgam","Vav"],"Bharuch":["Amod","Ankleshwar","Bharuch","Hansot","Jambusar","Jhagadia","Netrang","Vagra","Valia"],"Bhavnagar":["Bhavnagar","Botad","Gariadhar","Ghogha","Jesar","Mahuva","Palitana","Sihor","Talaja","Umrala","Vallabhipur"],"Botad":["Botad","Barwala","Gadhada","Ranpur"],"Chhota Udaipur":["Bodeli","Chhota Udaipur","Jetpur Pavi","Kavant","Nasvadi","Sankheda"],"Dahod":["Dahod","Devgadh Baria","Dhanpur","Fatepura","Garbada","Jhalod","Limkheda","Santrampur","Zalod"],"Dang":["Ahwa","Subir","Waghai"],"Devbhoomi Dwarka":["Bhanvad","Dwarka","Kalyanpur","Khambhalia"],"Gandhinagar":["Dehgam","Gandhinagar","Kalol","Mansa"],"Gir Somnath":["Gir Gadhada","Kodinar","Sutrapada","Talala","Una","Veraval"],"Jamnagar":["Dhrol","Jamnagar","Jodiya","Jodia","Kalavad","Lalpur"],"Junagadh":["Bhesan","Junagadh","Keshod","Mangrol","Mendarda","Malia","Vanthali","Visavadar"],"Kheda":["Balasinor","Kapadvanj","Kathlal","Kheda","Matar","Mahudha","Mehmedabad","Nadiad","Thasra","Vaso"],"Kutch":["Abdasa","Anjar","Bhachau","Bhuj","Gandhidham","Lakhpat","Mandvi","Mundra","Nakhatrana","Rapar"],"Mahisagar":["Balasinor","Kadana","Khanpur","Lunawada","Santrampur","Virpur"],"Mehsana":["Becharaji","Jotana","Kadi","Kheralu","Mehsana","Satlasana","Unjha","Vadnagar","Vijapur","Visnagar"],"Morbi":["Halvad","Maliya Miyana","Morbi","Tankara","Wankaner"],"Narmada":["Dediyapada","Garudeshwar","Nandod","Sagbara","Tilakwada"],"Navsari":["Chikhli","Gandevi","Jalalpore","Khergam","Navsari","Vansda"],"Panchmahal":["Ghoghamba","Godhra","Halol","Jambughoda","Kalol","Morwa Hadaf","Shehera"],"Patan":["Chanasma","Harij","Patan","Radhanpur","Santalpur","Sami","Sidhpur"],"Porbandar":["Kutiyana","Porbandar","Ranavav"],"Rajkot":["Dhoraji","Gondal","Jasdan","Jetpur","Kotda Sangani","Lodhika","Paddhari","Rajkot","Upleta","Vinchhiya","Wankaner"],"Sabarkantha":["Bayad","Himatnagar","Idar","Khedbrahma","Meghraj","Prantij","Talod","Vijaynagar"],"Surat":["Bardoli","Kamrej","Mandvi","Mangrol","Olpad","Palsana","Surat City","Umarpada","Mahuva","Vyara"],"Surendranagar":["Chotila","Dhrangadhra","Halvad","Limbdi","Muli","Sayla","Thangadh","Wadhwan"],"Tapi":["Dolvan","Kukarmunda","Nizar","Songadh","Ukai","Valod","Vyara"],"Vadodara":["Dabhoi","Karjan","Padra","Savli","Shinor","Vagodiya","Vadodara"],"Valsad":["Dharampur","Kaprada","Pardi","Umbergaon","Valsad"]},"Karnataka":{"Bagalkote":["Bagalkote","Badami","Bilgi","Hungund","Jamkhandi","Mudhol"],"Ballari":["Ballari","Hadagali","Hagaribommanahalli","Hoovina Hadagali","Kampli","Kudligi","Sandur","Siruguppa"],"Belagavi":["Athani","Bailhongal","Belagavi","Chikodi","Gokak","Hukkeri","Khanapur","Ramdurg","Raybag","Savadatti"],"Bengaluru Rural":["Devanahalli","Doddaballapura","Hosakote","Nelamangala"],"Bengaluru Urban":["Anekal","Bangalore East","Bangalore North","Bangalore South","Bengaluru","Kanakapura","Ramanagara"],"Bidar":["Aurad","Basavakalyan","Bhalki","Bidar","Humnabad"],"Chamarajanagar":["Chamarajanagar","Gundlupet","Kollegal","Yelandur"],"Chikkaballapura":["Bagepalli","Chikkaballapura","Chintamani","Gowribidanur","Gudibanda","Sidlaghatta"],"Chikkamagaluru":["Chikkamagaluru","Kadur","Koppa","Mudigere","NR Pura","Sringeri","Tarikere"],"Chitradurga":["Challakere","Chitradurga","Hiriyur","Holalkere","Hosadurga","Molakalmuru"],"Dakshina Kannada":["Bantwal","Beltangady","Kadaba","Mangaluru","Puttur","Sullia"],"Davangere":["Channagiri","Davangere","Harihara","Harapanahalli","Honnali","Jagalur"],"Dharwad":["Dharwad","Hubli","Kalghatgi","Kundgol","Navalgund"],"Gadag":["Gadag-Betageri","Mundaragi","Nargund","Ron","Shirahatti"],"Hassan":["Alur","Arakalagudu","Arkalgud","Belur","Hassan","Holenarasipura","Sakleshpur"],"Haveri":["Byadagi","Hanagal","Haveri","Hirekerur","Ranebennur","Savanur","Shiggaon"],"Kalaburagi":["Afzalpur","Aland","Chincholi","Chittapur","Kalaburagi","Jewargi","Sedam"],"Kodagu":["Kodagu","Somwarpet","Virajpet"],"Kolar":["Bangarpet","Kolar","Malur","Mulbagal","Srinivaspur"],"Koppal":["Gangavathi","Koppal","Kushtagi","Yelburga"],"Mandya":["Krishnarajapete","Maddur","Malavalli","Mandya","Nagamangala","Pandavapura","Srirangapatna"],"Mysuru":["H.D. Kote","Hunsur","K.R. Nagar","Mysuru","Nanjangud","Periyapatna","T. Narasipur"],"Raichur":["Devadurga","Lingsugur","Manvi","Raichur","Sindhanur"],"Ramanagara":["Channapatna","Kanakapura","Magadi","Ramanagara"],"Shivamogga":["Bhadravati","Hosanagar","Sagar","Shikaripura","Shivamogga","Sorab","Thirthahalli"],"Tumakuru":["Chiknayakanhalli","Gubbi","Koratagere","Kunigal","Madhugiri","Pavagada","Sira","Tiptur","Tumakuru","Turuvekere"],"Udupi":["Karkala","Kundapura","Udupi"],"Uttara Kannada":["Ankola","Bhatkal","Dandeli","Haliyal","Honavar","Joida","Karwar","Kumta","Mundgod","Siddapur","Sirsi","Yellapur"],"Vijayapura":["Basavana Bagewadi","Bijapur","Indi","Muddebihal","Sindagi"],"Yadgir":["Gurmatkal","Shahapur","Shorapur","Yadgir"],"Vijayanagara":["Hagaribommanahalli","Hoovina Hadagali","Kottur","Kudligi","Vijayanagara"]},"Tamil Nadu":{"Chennai":["Egmore-Nungambakkam","Fort-Tondiarpet","Mambalam-Guindy","Perambur-Purasaiwalkam","Sholinganallur","Tiruvottiyur"],"Coimbatore":["Annur","Coimbatore North","Coimbatore South","Kinathukadavu","Mettupalayam","Pollachi","Sulur","Valparai"],"Cuddalore":["Bhuvanagiri","Chidambaram","Cuddalore","Kattumannarkoil","Kurinjipadi","Panruti","Vriddhachalam"],"Dharmapuri":["Dharmapuri","Harur","Nammakkal","Palacode","Pennagaram"],"Dindigul":["Attur","Dindigul","Gujiliamparai","Kodaikanal","Natham","Nilakottai","Oddanchatram","Palani","Vedasandur"],"Erode":["Anthiyur","Bhavani","Erode","Gobichettipalayam","Kodumudi","Modakkurichi","Perundurai","Sathyamangalam"],"Kanchipuram":["Kanchipuram","Sriperumbudur","Uthiramerur"],"Kanyakumari":["Agastheeswaram","Kalkulam","Killiyoor","Vilavancode"],"Karur":["Aravakuruchi","Karur","Krishnarayapuram","Kulithalai","Manmangalam"],"Krishnagiri":["Bargur","Denkanikottai","Hosur","Krishnagiri","Pochampalli","Uthangarai","Veppanahalli"],"Madurai":["Kallupatti","Madurai North","Madurai South","Melur","Peraiyur","Thirparankundram","Usilampatti","Vadipatti"],"Mayiladuthurai":["Kuttalam","Mayiladuthurai","Sirkazhi","Sirkali","Thalainayar"],"Nagapattinam":["Kilvelur","Nagapattinam","Thirukkuvalai","Thalainayar","Vedaranyam"],"Namakkal":["Kolli Hills","Kumarapalayam","Mohanur","Namakkal","Rasipuram","Tiruchengode"],"Nilgiris":["Gudalur","Kotagiri","Ooty","Pandalur"],"Pudukkottai":["Alangudi","Aranthangi","Gandarvakottai","Karambakkudi","Kulathur","Manamelkudi","Ponnamaravathi","Pudukkottai","Tiruvarankulam","Viralimalai"],"Ramanathapuram":["Kamuthi","Kadaladi","Mudukulattur","Paramakudi","Rajasingamangalam","Ramanathapuram","Rameswaram","Tiruvadanai"],"Salem":["Attur","Edappadi","Gangavalli","Mettur","Omalur","Salem","Sankari","Yercaud"],"Sivaganga":["Devakottai","Ilayangudi","Kalayarkovil","Karaikudi","Manamadurai","Sivaganga","Tiruppattur","S.Pudur"],"Tenkasi":["Kadayanallur","Sankarankovil","Shencottai","Sivagiri","Tenkasi","Veerakeralampudur"],"Thanjavur":["Budalur","Kumbakonam","Orathanadu","Papanasam","Pattukkottai","Peravurani","Thanjavur","Thiruvidaimarudur"],"Theni":["Andipatti","Bodinayakanur","Periyakulam","Theni","Uthamapalayam"],"Thoothukudi":["Ettayapuram","Kovilpatti","Ottapidaram","Sathankulam","Srivaikuntam","Thiruchendur","Thoothukudi","Vilaathikulam"],"Tiruchirappalli":["Lalgudi","Manapparai","Manachanallur","Musiri","Srirangam","Thiruverumbur","Tiruchirappalli","Vaiyampatti"],"Tirunelveli":["Ambasamudram","Cheranmahadevi","Manur","Nanguneri","Palayamkottai","Radhapuram","Sankarankovil","Tirunelveli"],"Tirupathur":["Ambur","Jolarpettai","Natrampalli","Tirupathur","Vaniyambadi"],"Tiruppur":["Avinashi","Dharapuram","Kangeyam","Madathukulam","Palladam","Tiruppur","Udumalaipettai","Uthukuli"],"Tiruvallur":["Ambattur","Avadi","Gummidipoondi","Ponneri","Poonamallee","Tiruvallur","Tiruttani","Uthukottai"],"Tiruvannamalai":["Arni","Cheyyar","Chetpet","Jamunamarathur","Kalasapakkam","Kilpennathur","Polur","Tiruvannamalai","Vandavasi","Vembakkam"],"Tiruvarur":["Kodavasal","Mannargudi","Nannilam","Papanasam","Thiruthuraipoondi","Tiruvarur"],"Vellore":["Anaicut","Gudiyatham","Katpadi","Pallikonda","Vellore","Walajah"],"Viluppuram":["Gingee","Kallakurichi","Marakanam","Mugaiyur","Tirukoilur","Ulundurpet","Vanur","Villupuram"],"Virudhunagar":["Aruppukkottai","Kariapatti","Rajapalayam","Sivakasi","Srivilliputhur","Virudhunagar","Watrap"],"Chengalpattu":["Cheyyur","Chengalpattu","Kancheepuram","Madurantakam","Thiruporur","Uttiramerur"],"Kallakurichi":["Chinnasalem","Kallakurichi","Sankarapuram","Tirukoilur","Ulundurpet"],"Ranipet":["Arcot","Arakkonam","Nemili","Sholinghur","Walajah"]},"Andhra Pradesh":{"Sri Potti Sriramulu Nellore":["Allur","Atmakur","Kavali","Nellore","Sullurpeta","Udayagiri","Venkatachalam"],"Visakhapatnam":["Bheemunipatnam","Chodavaram","Paderu","Visakhapatnam","Anakapalli","Pedagantyada"],"Srikakulam":["Amadalavalasa","Etcherla","Itchapuram","Kanchili","Narasannapeta","Palakonda","Pathapatnam","Rajam","Sompeta","Srikakulam","Tekkali"],"Vizianagaram":["Bheemunipatnam","Bobbili","Gajapathinagaram","Nellimarla","Parvathipuram","S.Kota","Salur","Srungavarapukota","Vizianagaram"],"Parvathipuram Manyam":["Maredumilli","Parvathipuram","Seethampeta"],"Alluri Sitharama Raju":["Addateegala","Chintur","Devipatnam","Rampachodavaram","Yetapaka"],"Anakapalli":["Anakapalli","Chodavaram","Kasimkota","Munagapaka","Nakkapalli","Narsipatnam"],"Kakinada":["Gollaprolu","Kakinada","Peddapuram","Prathipadu","Ramachandrapuram","Tuni"],"East Godavari":["Amalapuram","Anaparthy","Biccavolu","Malkipuram","Peddapuram","Rajole","Rajanagaram"],"Dr. B.R. Ambedkar Konaseema":["Amalapuram","Mandapeta","Mummidivaram","Ramachandrapuram"],"West Godavari":["Bhimavaram","Eluru","Nidadavolu","Palakol","Tadepalligudem","Tanuku","Undi"],"Eluru":["Bhimavaram","Eluru","Nidadavolu","Tanuku","Palakol"],"Krishna":["Gudivada","Machilipatnam","Nandigama","Tiruvuru","Vijayawada"],"NTR":["Jaggaiahpet","Nandigama","Tiruvuru","Vijayawada Rural"],"Guntur":["Bapatla","Guntur","Mangalagiri","Narasaraopet","Ponnur","Sattenapalle","Tenali"],"Bapatla":["Bapatla","Chirala","Narasaraopet","Ponnur"],"Palnadu":["Gurazala","Macherla","Narasaraopet","Piduguralla"],"Prakasam":["Addanki","Kandukur","Markapur","Ongole","Podili"],"Nandyal":["Allagadda","Banaganapalle","Dhone","Kurnool","Nandyal","Pattikonda"],"Kurnool":["Adoni","Allagadda","Dhone","Gudur","Kurnool","Nandyal","Pattikonda"],"Ananthapuramu":["Anantapur","Dharmavaram","Guntakal","Hindupur","Kadiri","Tadipatri"],"Sri Sathya Sai":["Dharmavaram","Hindupur","Kadiri","Puttaparthi"],"Chittoor":["Chittoor","Kuppam","Madanapalle","Piler","Tirupati"],"Tirupati":["Chandragiri","Tirupati","Yerpedu"],"Annamayya":["Kadapa","Rajampet","Rayachoti"],"YSR Kadapa":["Badvel","Jammalamadugu","Kadapa","Kamalapuram","Mydukur","Proddatur","Pulivendla","Rajampet"]},"Telangana":{"Hyderabad":["Amberpet","Bandlaguda Jagir","Hayathnagar","Kapra","Khairatabad","Kukatpally","Musheerabad","Nampally","Secunderabad"],"Rangareddy":["Chevella","Hayathnagar","Ibrahimpatnam","Kandukur","Kothur","Maheshwaram","Marpalle","Rajendranagar","Shadnagar","Shamshabad","Tandur"],"Medchal-Malkajgiri":["Ghatkesar","Keesara","Kompally","Malkajgiri","Medchal","Quthbullapur","Uppal"],"Karimnagar":["Choppadandi","Huzurabad","Husnabad","Jagtial","Karimnagar","Manakondur","Metpalle","Shankarapatnam"],"Warangal":["Atmakur","Cherial","Narsampet","Parkal","Parvathagiri","Rayaparthi","Sangem","Warangal"],"Nalgonda":["Addakal","Bhongir","Devarakonda","Miryalaguda","Nalgonda","Nakrekal","Nidamanur","Suryapet"],"Khammam":["Aswaraopeta","Bhadrachalam","Burgampahad","Kothagudem","Khammam","Madhira","Palwancha"],"Adilabad":["Adilabad","Asifabad","Bhainsa","Boath","Ichoda","Jainath","Mandamarri","Nirmal","Utnoor"],"Nizamabad":["Armoor","Banswada","Bodhan","Kamareddy","Nizamabad","Yellareddy"],"Mahabubnagar":["Achampet","Badepally","Gadwal","Kalwakurthy","Kollapur","Mahabubnagar","Makthal","Narayanpet"],"Medak":["Andole","Jogipet","Medak","Narsapur","Papannapet","Ramayampet","Siddipet","Toopran"],"Suryapet":["Mothkur","Nalgonda","Suryapet","Thungathurthi"],"Yadadri Bhuvanagiri":["Aler","Bhongir","Bhuvanagiri","Mothkur","Ramannapeta","Turkapally"]},"Kerala":{"Thiruvananthapuram":["Chirayinkeezhu","Kattakkada","Nedumangad","Neyyattinkara","Thiruvananthapuram","Varkala"],"Kollam":["Chadayamangalam","Chathanoor","Karunagappally","Kottarakkara","Kunnathur","Pathanapuram","Punalur","Kollam"],"Pathanamthitta":["Adoor","Kozhencherry","Mallappally","Pathanamthitta","Ranni","Thiruvalla","Konni"],"Alappuzha":["Alappuzha","Ambalappuzha","Chengannur","Cherthala","Karthikappally","Kuttanad","Mavelikkara"],"Kottayam":["Changanacherry","Kanjirappally","Kottayam","Meenachil","Vaikom"],"Idukki":["Devikulam","Idukki","Peermade","Thodupuzha","Udumbanchola"],"Ernakulam":["Aluva","Ernakulam","Kanayannur","Kochi","Kothamangalam","Kunnathunad","Muvattupuzha","Paravur"],"Thrissur":["Chalakudy","Irinjalakuda","Kodungallur","Kunnamkulam","Mukundapuram","Talappilly","Thrissur"],"Palakkad":["Alathur","Attappady","Chittur","Mannarkkad","Ottappalam","Palakkad","Pattambi","Thrithala"],"Malappuram":["Ernad","Kondotty","Malappuram","Manjeri","Nilambur","Perinthalmanna","Ponnani","Tirur","Tiruvali","Vettathur"],"Kozhikode":["Koduvally","Kozhikode","Mukkam","Perambra","Thamarassery","Vadakara"],"Wayanad":["Mananthavady","Sulthan Bathery","Vythiri"],"Kannur":["Iritty","Kannur","Koothuparamba","Mananthavady","Payyannur","Thalassery"],"Kasaragod":["Hosdurg","Kasaragod","Manjeshwar","Vavul Mala"]},"Bihar":{"Patna":["Barh","Bikram","Danapur","Daniawan","Fatuha","Khusrupur","Masaurhi","Mokama","Naubatpur","Paliganj","Patna City","Phulwari","Sampatchak"],"Gaya":["Amas","Atri","Barachatti","Belaganj","Bodh Gaya","Fatehpur","Gaya","Gurua","Imamganj","Khizarsarai","Konch","Manpur","Mohanpur","Paraiya","Sherghati","Tekari","Wazirganj"],"Muzaffarpur":["Aurai","Bochaha","Gayghat","Kanti","Katra","Kurhani","Muraul","Musahari","Muzaffarpur","Paru","Sakra","Saraiya","Minapur"],"Darbhanga":["Alinagar","Baheri","Bahadurpur","Benipur","Biraul","Darbhanga","Ghanshyampur","Hayaghat","Jale","Keoti","Manigachhi"],"Bhagalpur":["Bhagalpur","Bihpur","Jagdishpur","Kahalgaon","Naugachhia","Pirpainti","Shahkund","Sultanganj"],"Nalanda":["Asthawan","Biharsharif","Bind","Chandi","Ekangarsarai","Giriyak","Harnaut","Hilsa","Islampur","Noorsarai","Rajgir","Rahui","Silao"],"Saran":["Amnour","Chapra","Dighwara","Ekma","Garkha","Ishuapur","Jalalpur","Maker","Mashrakh","Parsa","Panapur","Revelganj","Sonepur","Taraiya"],"Vaishali":["Bidupur","Desri","Hajipur","Jandaha","Lalganj","Mahua","Mahnar","Patepur","Patti","Raghopur","Sahdei Buzurg","Vaishali","Vishambharpur"],"Siwan":["Andar","Barharia","Bhagwanpur Hat","Darauli","Dariyapur","Goriakothi","Hussainganj","Lakri Nabiganj","Maharajganj","Mairwa","Nautan","Pachrukhi","Raghunathpur","Siswan","Siwan","Ziradei"]},"Uttar Pradesh":{"Lucknow":["Lucknow","Malihabad","Mohanlalganj","Bakshi Ka Talab","Sarojini Nagar"],"Agra":["Agra","Bah","Etmadpur","Fatehabad","Fatehpur Sikri","Kheragarh","Kiraoli"],"Varanasi":["Varanasi","Arajiline","Chiraigaon","Kashi Vidyapeeth","Pindra","Sewapuri"],"Prayagraj":["Allahabad","Bara","Chaka","Handia","Karchhana","Koraon","Meja","Phulpur","Soraon"],"Kanpur Nagar":["Bilhaur","Ghatampur","Kalyanpur","Kanpur","Mandhana"],"Gorakhpur":["Bansgaon","Campierganj","Chauri Chaura","Gola","Gorakhpur","Jungle Kaudia","Khajni","Sahjanwa"],"Meerut":["Hapur","Meerut","Mawana","Sardhana"],"Mathura":["Chhata","Govardhan","Mahavan","Mathura","Mat","Mant"],"Bareilly":["Aonla","Baheri","Bareilly","Faridpur","Meerganj","Nawabganj"],"Aligarh":["Aligarh","Atrauli","Gangiri","Iglas","Khair"],"Ghaziabad":["Dhaulana","Ghaziabad","Hapur","Loni","Modinagar","Muradnagar"],"Jhansi":["Babina","Bangra","Chirgaon","Garautha","Jhansi","Mauranipur","Moth"],"Ayodhya":["Bikapur","Faizabad","Haveli","Milkipur","Pura Bazar","Sohawal","Tanda"]},"Uttarakhand":{"Dehradun":["Chakrata","Dehradun","Doiwala","Kalsi","Rishikesh","Sahiya","Vikasknagar"],"Haridwar":["Bhagwanpur","Haridwar","Laksar","Narsan","Roorkee"],"Nainital":["Betalghat","Dhari","Haldwani","Kaladhungi","Kotabagh","Nainital","Okhalkanda","Ramnagar"],"Pauri Garhwal":["Bironkhal","Dwarikhal","Ekeshwar","Jaykot","Khirsu","Kotdwar","Lansdowne","Pabo","Pauri","Paurari","Raikholi","Rikhnikhal","Satpuli","Thalisain"],"Almora":["Almora","Bhaisiyachhana","Dwarahat","Jainti","Lamgara","Salt","Someshwar"],"Tehri Garhwal":["Devprayag","Ghansali","Jakhnidhar","Jaunpur","Narendra Nagar","Pratapnagar","Tehri"],"Chamoli":["Chamoli","Gairsain","Ghad","Joshimath","Karanprayag","Narayan Bagar","Tharali"],"Pithoragarh":["Berinag","Didihat","Gangolihat","Munsiari","Pithoragarh","Dharchula"],"Uttarkashi":["Bhatwari","Chinyalisaur","Dunda","Mori","Naugaon","Purola"],"Bageshwar":["Bageshwar","Garur","Kapkot"],"Champawat":["Champawat","Lohaghat","Pati"],"Rudraprayag":["Agastyamuni","Jakholi","Rudraprayag","Ukhimath"],"Udham Singh Nagar":["Bajpur","Gadarpur","Jaspur","Kashipur","Khatima","Kichha","Rudrapur","Sitarganj"]},"Himachal Pradesh":{"Shimla":["Chopal","Jubbal","Kotkhai","Kumarsain","Rampur","Rohru","Shimla"],"Kangra":["Baijnath","Dehra","Dharamshala","Fatehpur","Indora","Jawali","Jwalamukhi","Kangra","Nurpur","Palampur"],"Mandi":["Balh","Chachyot","Dharampur","Joginder Nagar","Karsog","Mandi","Sadar","Sarkaghat","Sundernagar"],"Solan":["Arki","Kandaghat","Kasauli","Nalagarh","Solan"],"Sirmaur":["Nahan","Pachhad","Paonta Sahib","Rajgarh","Shillai"],"Bilaspur":["Bilaspur","Ghumarwin","Naina Devi","Swarghat"],"Kullu":["Anni","Banjar","Kullu","Manali","Nirmand","Sainj"],"Hamirpur":["Bhoranj","Hamirpur","Nadaun","Sujanpur"],"Chamba":["Bharmour","Chamba","Churah","Pangi","Tissa"],"Una":["Amb","Bangana","Haroli","Santokhgarh","Una"],"Kinnaur":["Baspa","Hangrang","Kalpa","Pooh"],"Lahaul & Spiti":["Lahaul","Spiti"]},"Punjab":{"Amritsar":["Ajnala","Amritsar","Attari","Baba Bakala","Jandiala Guru","Lopoke","Majitha","Rayya"],"Jalandhar":["Jalandhar","Nakodar","Phillaur","Rurka Kalan","Shahkot"],"Ludhiana":["Dehlon","Jagraon","Khanna","Ludhiana East","Ludhiana West","Payal","Raikot","Samrala"],"Patiala":["Fatehgarh Sahib","Nabha","Patiala","Rajpura","Samana","Sirhind"],"SAS Nagar (Mohali)":["Dera Bassi","Kharar","Kurali","Mohali"],"Bathinda":["Bathinda","Maur","Phul","Rampura Phul","Sangat","Talwandi Sabo"],"Gurdaspur":["Batala","Dinanagar","Fatehgarh Churian","Gurdaspur","Kahnuwan","Dera Baba Nanak"],"Hoshiarpur":["Dasuya","Garhshankar","Hoshiarpur","Mahilpur","Mukerian","Tanda"],"Kapurthala":["Dhilwan","Kapurthala","Phagwara","Sultan Pur Lodhi"],"Sangrur":["Dhuri","Lehra Gaga","Malerkotla","Moonak","Sangrur","Sunam"],"Faridkot":["Faridkot","Jaitu","Kotkapura"],"Ferozepur":["Ferozepur","Firozpur Cantt","Guruharsahai","Jalalabad","Zira"],"Moga":["Baghapurana","Moga","Nihal Singh Wala"],"Tarn Taran":["Khem Karan","Patti","Tarn Taran"],"Fatehgarh Sahib":["Amloh","Bassi Pathana","Fatehgarh Sahib","Khanna"],"Rupnagar":["Anandpur Sahib","Chamkaur Sahib","Morinda","Nurpur Bedi","Rupnagar"],"Pathankot":["Dhar Kalan","Pathankot","Sujanpur"],"Shahid Bhagat Singh Nagar":["Balachaur","Nawanshahar"],"Sri Muktsar Sahib":["Giddarbaha","Lambi","Malout","Muktsar"],"Mansa":["Budhlada","Mansa","Sardulgarh"],"Fazilka":["Abohar","Fazilka","Jalalabad"],"Malerkotla":["Ahmedgarh","Malerkotla"]},"Jharkhand":{"Ranchi":["Angara","Bundu","Chanho","Itki","Kanke","Lapung","Mandar","Namkum","Ormanjhi","Ratu","Silli","Sonahatu","Tamar"],"Dhanbad":["Baghmara","Baliapur","Dhanbad","Govindpur","Nirsa","Tundi"],"Bokaro":["Bermo","Bokaro","Chandankiyari","Chas","Gomia","Jaridih","Nawadih"],"Hazaribagh":["Barhi","Barkagaon","Barkatha","Churchu","Hazaribagh","Ichak","Katkamsandi","Padma"],"Giridih":["Bagodar","Bengabad","Birni","Deori","Dhanwar","Dumri","Gandey","Giridih","Jamua","Pirtand","Tisri"],"Deoghar":["Deoghar","Madhupur","Mohanpur","Palojori","Sarwan","Sarth"],"Dumka":["Dumka","Gopikandar","Jama","Jarmundi","Kathikund","Masalia","Raneshwar","Shikaripara"],"East Singhbhum":["Boram","Dhalbhum","Dhalbhumgarh","Jamshedpur","Baharagora","Chakulia"],"West Singhbhum":["Chakradharpur","Chaibasa","Goilkera","Jagannathpur","Manoharpur","Tonto"],"Lohardaga":["Bhandra","Kiskindah","Kuru","Lohardaga","Senha"],"Gumla":["Bishunpur","Chainpur","Dumri","Ghaghra","Gumla","Palkot","Raidih","Sisai"],"Simdega":["Bano","Bolba","Jaldega","Kolebira","Kurdeg","Simdega","Thethaitangar"],"Palamu":["Chainpur","Hariharganj","Hussainabad","Lesliganj","Medininagar","Pandu","Satbarwa","Tarhasi"],"Garhwa":["Bhawnathpur","Bhandariya","Chiniya","Garhwa","Ketar","Meral","Ranka","Sagma"],"Chatra":["Chatra","Hunterganj","Itkhori","Kanda","Lawalong","Pathalgadda","Pratappur","Simaria"],"Koderma":["Domchanch","Jainagar","Koderma","Satgawan"],"Latehar":["Balumath","Chandwa","Garu","Latehar","Manika"],"Khunti":["Arki","Karra","Khunti","Murhu","Rania","Torpa"],"Jamtara":["Fatehpur","Jamtara","Karmatand","Kundhit","Mihijam","Nala"],"Pakur":["Amrapara","Hiranpur","Littipara","Maheshpur","Pakur"],"Sahibganj":["Barhait","Borio","Mandaro","Pathna","Rajmahal","Sahibganj","Taljhari","Udhwa"],"Ramgarh":["Chitarpur","Dulmi","Gola","Mandu","Patratu","Ramgarh"],"Godda":["Boarijor","Godda","Mahagama","Meherma","Pathargama","Poraiyahat","Sundarpahari"]},"Odisha":{"Khordha":["Balianta","Balipatna","Banpur","Bhubaneswar","Bolagarh","Chilika","Jatani","Khordha","Tangi"],"Cuttack":["Athagarh","Badamba","Banki","Baramba","Cuttack Sadar","Dampara","Kantapada","Mahanga","Niali","Salepur","Tigiria"],"Puri":["Astaranga","Brahmagiri","Delanga","Gop","Kakatpur","Nimapara","Pipili","Puri","Satyabadi"],"Ganjam":["Aska","Bhanjanagar","Buguda","Chhatrapur","Digapahandi","Ganjam","Hinjili","Kodala","Purushottampur","Surada"],"Balasore":["Balasore","Bahanaga","Basta","Bhograi","Jaleswar","Nilgiri","Remuna","Simulia","Soro"],"Sambalpur":["Bamra","Jamankira","Kuchinda","Rengali","Sambalpur"],"Sundargarh":["Bonai","Gurundia","Hemgir","Kuanrmunda","Lephripada","Rajgangpur","Sundargarh","Tangarpali"],"Koraput":["Boipariguda","Dasmantpur","Jeypore","Koraput","Kotpad","Laxmipur","Kundra","Narayanpatna","Pottangi"],"Mayurbhanj":["Baripada","Bahalda","Bangriposi","Bisoi","Jashipur","Kaptipada","Rairangpur","Udala"]},"Assam":{"Kamrup Metropolitan":["Azara","Chandrapur","Dispur","Guwahati","Jalukbari","North Guwahati","Rani"],"Kamrup":["Boko","Chaygaon","Goroimari","Kamalpur","Nagarbera","Rangia","Sualkuchi"],"Dibrugarh":["Barbaruah","Chabua","Dibrugarh","Joypur","Khowang","Lahowal","Moran"],"Jorhat":["Jorhat","Jorhat East","Titabor","Teok","Mariani"],"Sivasagar":["Demow","Gaurisagar","Nazira","Sivasagar","Sonari"],"Nagaon":["Batadrava","Dhing","Hojai","Kaliabor","Kampur","Nagaon","Raha","Rupahihat"],"Barpeta":["Bajali","Barpeta","Bhabanipur","Chenga","Jania","Mandia","Sarthebari"],"Sonitpur":["Biswanath","Dhekiajuli","Gohpur","Missamari","Naduar","Rangapara","Tezpur"],"Lakhimpur":["Boginadi","Dhakuakhana","Lakhimpur","Narayanpur","Nowboischa"],"Cachar":["Borkhola","Katigorah","Lakhipur","Silchar","Sonai","Udharbond"],"Karbi Anglong":["Bokajan","Diphu","Hamren","Langsomepi","Rongmongwe"],"Goalpara":["Balijana","Dudhnoi","Goalpara","Krishnai","Matia"]},"West Bengal":{"Kolkata":["Kolkata"],"North 24 Parganas":["Ashoknagar","Baduria","Barasat","Basirhat","Bongaon","Deganga","Habra","Minakhan","Rajarhat","Swarupnagar"],"South 24 Parganas":["Baruipur","Bishnupur","Canning","Diamond Harbour","Joynagar","Kakdwip","Sonarpur"],"Howrah":["Amta","Bagnan","Domjur","Jagatballavpur","Panchla","Udaynarayanpur","Uluberia"],"Hooghly":["Arambag","Chandannagore","Chinsurah","Dhaniakhali","Pursurah","Serampore","Singur","Tarakeswar"],"Darjeeling":["Darjeeling","Kalimpong","Kurseong","Mirik","Siliguri"],"Murshidabad":["Berhampore","Domkal","Jangipur","Kandi","Lalbag","Nawda","Raghunathganj"],"Birbhum":["Bolpur","Labpur","Mohammad Bazar","Murarai","Nalhati","Rampurhat","Sainthia","Suri"],"Nadia":["Chakdaha","Krishnagar","Nabadwip","Ranaghat","Santipur"],"Malda":["English Bazar","Harishchandrapur","Kaliachak","Manikchak","Old Malda","Ratua"],"Purba Bardhaman":["Ausgram","Burdwan","Kalna","Katwa","Ketugram","Mangalkot"],"Paschim Bardhaman":["Asansol","Durgapur","Kanksa","Ondal"],"Paschim Medinipur":["Chandrakona","Daspur","Ghatal","Garbeta","Jhargram","Keshpur","Kharagpur","Medinipur","Narayangarh","Pingla","Salbani"],"Purba Medinipur":["Contai","Egra","Haldia","Mahishadal","Nandigram","Tamluk"],"Jalpaiguri":["Alipurduar","Dhupguri","Falakata","Jalpaiguri","Mal","Maynaguri","Malbazar"],"Cooch Behar":["Cooch Behar","Dinhata","Mathabhanga","Mekhliganj","Sitai","Tufanganj"]},"Delhi":{"Central Delhi":["Connaught Place","Daryaganj","Karol Bagh","Paharganj"],"New Delhi":["Chanakyapuri","New Delhi","Sarojini Nagar"],"South Delhi":["Hauz Khas","Kalkaji","Mehrauli","Saket"],"North Delhi":["Civil Lines","Model Town","Narela","Sadar Bazar"],"East Delhi":["Gandhi Nagar","Krishna Nagar","Patparganj","Preet Vihar"],"West Delhi":["Delhi Cantonment","Janakpuri","Rajouri Garden","Uttam Nagar"],"North West Delhi":["Bawana","Kanjhawala","Mangolpuri","Rohini","Sultanpuri"],"North East Delhi":["Gokulpuri","Nandnagri","Seelampur","Shahdara","Vivek Vihar"],"South East Delhi":["Laxmi Nagar","Mayur Vihar"],"South West Delhi":["Bijwasan","Dwarka","Palam","Vasant Vihar"],"Shahdara":["Dilshad Garden","Ghonda","Maujpur","Nand Nagri","Shahdara"]},"Jammu & Kashmir":{"Srinagar":["Eidgah","Hazratbal","Khanyar","Pantha Chowk","Shalteng","Tullamulla","Chadoora","Kangan"],"Jammu":["Akhnoor","Bishnah","Jammu","Marh","Nagrota","R.S. Pura","Suchetgarh","Samba"],"Baramulla":["Baramulla","Boniyar","Kreeri","Kunzer","Pattan","Rafiabad","Sopore","Uri"],"Anantnag":["Anantnag","Bijbehara","Dooru","Pahalgam","Shangus","Shahabad","Kokernag","Qazigund"],"Kupwara":["Handwara","Karnah","Keran","Kupwara","Lolab","Sogam","Trehgam"],"Budgam":["Beerwah","Budgam","Chadoora","Chrar-i-Sharief","Khansahib","Narbal","Soibugh"],"Pulwama":["Awantipora","Pampore","Pulwama","Tral"],"Bandipora":["Bandipora","Gurez","Hajin","Sonawari","Sumbal"],"Ganderbal":["Ganderbal","Kangan","Lar","Tulmula"],"Kulgam":["D.H. Pora","Devsar","Kulgam","Noorabad","Yaripora"],"Shopian":["Kellar","Shopian","Zainpora"],"Doda":["Bhaderwah","Doda","Gandoh","Marmat","Thathri"],"Ramban":["Banihal","Ramban","Ramsoo"],"Kishtwar":["Chatroo","Kishtwar","Marwah","Nagseni","Padder"],"Reasi":["Arnas","Mahore","Pouni","Reasi","Shri Mata Vaishno Devi","Tuksan"],"Rajouri":["Budhal","Darhal","Kalakote","Kotranka","Nowshera","Rajouri","Sunderbani","Thanamandi"],"Poonch":["Mandi","Mendhar","Poonch","Surankote"],"Kathua":["Basholi","Billawar","Bani","Hiranagar","Kathua","Mahanpur"],"Udhampur":["Chenani","Majalta","Moungri","Ramnagar","Udhampur"]},"Ladakh":{"Leh":["Durbuk","Leh","Nubra","Nyoma","Khaltsi","Zanskar"],"Kargil":["Drass","Kargil","Sankoo","Shakar Chiktan","Taisuru","Zanskar"]},"Goa":{"North Goa":["Bardez","Bicholim","Pernem","Ponda","Sattari","Tiswadi"],"South Goa":["Canacona","Dharbandora","Mormugao","Quepem","Salcete","Sanguem"]},"Sikkim":{"East Sikkim":["Gangtok","Pakyong","Rongli","Rhenock"],"Gyalshing":["Gyalshing","Dentam"],"Mangan":["Chungthang","Mangan"],"Namchi":["Jorethang","Namchi","Ravangla"],"Pakyong":["Pakyong","Rangpo","Rhenock"],"Soreng":["Soreng","Timburbong"]},"Tripura":{"West Tripura":["Bishalgarh","Jirania","Mohanpur","Sadar","Khowai"],"South Tripura":["Belonia","Bokafa","Hrishyamukh","Santirbazar","Sabroom","Rajnagar"],"North Tripura":["Dharmanagar","Kanchanpur","Panisagar","Jampui Hills"],"Dhalai":["Ambassa","Gandacherra","Kalyanpur","Manu"],"Khowai":["Khowai","Mungiakami","Padmabil","Teliamura"],"Gomati":["Amarpur","Karbook","Ompi","Silachari","Tepania"],"Sepahijala":["Bishalgarh","Charilam","Jampuijala","Kathalia","Sonamura"],"Unakoti":["Kailashahar","Kumarghat","Laljuri","Machmara"]},"Chhattisgarh":{"Raipur":["Abhanpur","Arang","Dharsiwa","Raipur","Tilda"],"Durg":["Bhilai","Durg","Patan"],"Bilaspur":["Bilaspur","Gaurela","Kota","Masturi","Mungeli","Takhatpur"],"Bastar":["Bakawand","Bastar","Darbha","Jagdalpur","Lohandiguda","Tokapal"],"Raigarh":["Dharamjaigarh","Gharghoda","Kharsiya","Lailunga","Raigarh","Sarangarh","Tamnar"],"Surguja":["Ambikapur","Bhaiyathan","Lundra","Odgi","Pratappur","Ramanujganj","Sitapur"],"Korba":["Katghora","Korba","Kartala","Pali","Poori"],"Rajnandgaon":["Chhuriya","Dongargaon","Khairagarh","Mohla","Rajnandgaon"]},"Meghalaya":{"East Khasi Hills":["Mairang","Mawkynrew","Mawphlang","Mawryngkneng","Mylliem","Shella-Bholaganj","Shillong","Sohra","Sohiong"],"West Garo Hills":["Dadenggre","Gambegre","Tura","Selsella"],"South Garo Hills":["Baghmara","Chokpot","Resubelpara"],"North Garo Hills":["Resubelpara","Mendipathar"],"Ri Bhoi":["Jirang","Nongpoh","Umsning"],"West Jaintia Hills":["Jowai","Thadlaskein"],"East Jaintia Hills":["Amlarem","Khliehriat"]},"Mizoram":{"Aizawl":["Aibawk","Aizawl","Darlawn","Phullen","Thingsulthliah"],"Lunglei":["Bunghmun","Lunglei","Lungsen","Tlabung","West Bunghmun"],"Champhai":["Champhai","Khawbung","Ngopa"],"Kolasib":["Kolasib","Thingdawl","Vairengte"],"Serchhip":["Serchhip","Thenzawl"],"Lawngtlai":["Chawngte","Lawngtlai","Lungpher"],"Mamit":["Mamit","Phaileng","West Phaileng"]},"Manipur":{"Imphal West":["Imphal West","Lamphel","Patsoi","Sekmaijin","Langthabal"],"Imphal East":["Heingang","Imphal East","Jiribam","Thongkhong","Porompat"],"Bishnupur":["Bishnupur","Kumbi","Moirang","Nambol","Oinam"],"Thoubal":["Kakching","Lilong","Thoubal","Wangjing","Yairipok"],"Senapati":["Kangpokpi","Mao","Paomata","Purul","Senapati"],"Churachandpur":["Churachandpur","Henglep","Singhat","Tipaimukh"],"Ukhrul":["Chingai","Kasom Khullen","Ukhrul"],"Chandel":["Chandel","Chakpikarong","Machi","Tengnoupal"]},"Nagaland":{"Kohima":["Kohima","Kezocha","Zubza"],"Dimapur":["Dimapur","Ghaspani","Medziphema"],"Mokokchung":["Changtongya","Mangkolemba","Mokokchung","Ongpangkong"],"Tuensang":["Noklak","Shamator","Tobu","Tuensang"],"Mon":["Aboi","Mon","Tizit"],"Wokha":["Sanis","Tuli","Wokha"],"Phek":["Chizami","Pfutsero","Phek"],"Zunheboto":["Akuluto","Satakha","Suruhuto","Zunheboto"],"Peren":["Jalukie","Peren","Tening"]},"Arunachal Pradesh":{"Papum Pare":["Balijan","Doimukh","Itanagar","Sagalee"],"East Siang":["Nari-Koyu","Pasighat","Ruksin"],"Tawang":["Lumla","Tawang"],"West Kameng":["Bomdila","Dirang","Khellong","Singchung"],"Lower Subansiri":["Raga","Ziro"],"Upper Subansiri":["Daporijo","Nacho"],"Changlang":["Changlang","Kharsang","Nampong","Vijaynagar"],"Lohit":["Namsai","Tezu","Wakro"],"East Kameng":["Seppa","Bameng"]},"Andaman & Nicobar Islands":{"South Andaman":["Ferrargunj","Port Blair","Tushnabad","Wandoor"],"North & Middle Andaman":["Diglipur","Mayabunder","Rangat"],"Nicobar":["Car Nicobar","Great Nicobar","Nancowry"]},"Chandigarh":{"Chandigarh":["Chandigarh"]},"Dadra & Nagar Haveli and Daman & Diu":{"Dadra & Nagar Haveli":["Dadra","Nagar Haveli","Silvassa"],"Daman":["Daman","Nani Daman"],"Diu":["Diu"]},"Lakshadweep":{"Lakshadweep":["Agatti","Amini","Androth","Kadmat","Kavaratti","Kiltan","Minicoy"]},"Puducherry":{"Puducherry":["Ariyankuppam","Bahour","Mannadipet","Nettapakkam","Oulgaret","Puducherry","Villiyanur"],"Karaikal":["Karaikal","Kottucherry","Nedungadu","Thirunallar"],"Mahe":["Mahe"],"Yanam":["Yanam"]}},"gotra":{"Gautam":["Patodhya","Palod","Acharya Nuwal","Bhabhda","Kumbhya","Kanth","Khatod","Budsuna","Bagduya","Vedvant","Vanansidra","Lelodhya","Kakda","Gagvani","Bhuwal","Budadhara"],"Vatsa":["Mang","Koliwal","Ratava","Baldava","Rolanya","Cholsankhya","Jopat","Intodhya","Polgala","Nosara","Namaval","Ajmera","Kukda","Taranva","Avdig","Didel","Musya"],"Bhardwaj":["Pedwal","Shukl","Karesiya","Malodhya","Asopa","Lyali","Barmota","Indorewal","Hulsura","Bhatlya","Gadiya","Solyani"],"Kochhas":["Gothecha","Kudal","Dhavdoda","Jatalya","Didvaniya Tiwadi","Dobha Acharya","Vetaval","Mandolya","Manjabal","Mundel","Sosi"],"Bhargav":["Inaniya","Prathanya","Kaslya","Khewar","Bisawa","Ladanva","Shilnodhya","Jajodhya","Kuradaya","Badagana","Kapdodhya"],"Shandilya":["Bahad","Bediya","Rinwa","Dahval","Gothwal"],"Atreya":["Dubanya","Jujhnodiya","Sukalya","Soothwal"],"Kashyap":["Dorolya","Jamaval","Balaya","Borayada","Rajthala","Badwa","Shirgota","Cholkhya"],"Parasar":["Bheda Vyas","Parasara"],"Kapil":["Chipda"],"Garg":["Tulchya"]}};
const STATES=LOC.states,DIST=LOC.districts,TEH=LOC.tehsils,GOTRA=LOC.gotra;
const OTHER='__other',OTHER_OPT='<option value="__other">अन्य (सूची में नहीं है – स्वयं लिखें)</option>';
const STATE_HI={'Andhra Pradesh':'आंध्र प्रदेश','Arunachal Pradesh':'अरुणाचल प्रदेश','Assam':'असम','Bihar':'बिहार','Chhattisgarh':'छत्तीसगढ़','Goa':'गोवा','Gujarat':'गुजरात','Haryana':'हरियाणा','Himachal Pradesh':'हिमाचल प्रदेश','Jharkhand':'झारखंड','Karnataka':'कर्नाटक','Kerala':'केरल','Madhya Pradesh':'मध्य प्रदेश','Maharashtra':'महाराष्ट्र','Manipur':'मणिपुर','Meghalaya':'मेघालय','Mizoram':'मिज़ोरम','Nagaland':'नागालैंड','Odisha':'ओडिशा','Punjab':'पंजाब','Rajasthan':'राजस्थान','Sikkim':'सिक्किम','Tamil Nadu':'तमिलनाडु','Telangana':'तेलंगाना','Tripura':'त्रिपुरा','Uttar Pradesh':'उत्तर प्रदेश','Uttarakhand':'उत्तराखंड','West Bengal':'पश्चिम बंगाल','Andaman & Nicobar Islands':'अंडमान और निकोबार द्वीप समूह','Chandigarh':'चंडीगढ़','Dadra & Nagar Haveli and Daman & Diu':'दादरा और नगर हवेली तथा दमन और दीव','Delhi':'दिल्ली','Jammu & Kashmir':'जम्मू और कश्मीर','Ladakh':'लद्दाख','Lakshadweep':'लक्षद्वीप','Puducherry':'पुदुचेरी'};
const stateLabel=x=>x||'';   // states are shown in English only
/* Older saved records may hold a Hindi state name; map it back to the English key */
const normState=x=>STATES.includes(x)?x:(Object.keys(STATE_HI).find(k=>STATE_HI[k]===x)||'');   // unknown / empty stays empty (no silent default)
const SC={'Andhra Pradesh':'AP','Arunachal Pradesh':'AR','Assam':'AS','Bihar':'BR','Chhattisgarh':'CG','Goa':'GA','Gujarat':'GJ','Haryana':'HR','Himachal Pradesh':'HP','Jharkhand':'JH','Karnataka':'KA','Kerala':'KL','Madhya Pradesh':'MP','Maharashtra':'MH','Manipur':'MN','Meghalaya':'ML','Mizoram':'MZ','Nagaland':'NL','Odisha':'OD','Punjab':'PB','Rajasthan':'RJ','Sikkim':'SK','Tamil Nadu':'TN','Telangana':'TS','Tripura':'TR','Uttar Pradesh':'UP','Uttarakhand':'UK','West Bengal':'WB','Andaman & Nicobar Islands':'AN','Chandigarh':'CH','Dadra & Nagar Haveli and Daman & Diu':'DD','Delhi':'DL','Jammu & Kashmir':'JK','Ladakh':'LA','Lakshadweep':'LD','Puducherry':'PY'};
/* Reverse lookup: saakh → gotra (choosing a saakh auto-selects its gotra) */
const SAAKH_GOTRA={};Object.entries(GOTRA).forEach(([g,l])=>l.forEach(x=>SAAKH_GOTRA[x]=g));
const KEY='dadhich_parivar_2026';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>'id_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const SVG={edit:'<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',del:'<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2m-9 0l1 14h8l1-14M10 11v6M14 11v6"/></svg>'};

/* ===== Storage layer (replace with backend API later) ===== */
const Store={
  load(){try{return JSON.parse(localStorage.getItem(KEY))||{families:[]}}catch(e){return {families:[]}}},
  save(db){try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){alert('डेटा सुरक्षित नहीं हो सका। ब्राउज़र स्टोरेज उपलब्ध नहीं है।');return false}}
};
let db=Store.load(), view=db.families[0]?.members?.some(m=>m.role==='mukhiya')?'dash':'mukhiya', editId=null, flash='';
db.families.forEach(f=>f.members.forEach(m=>{if(m.prof)m.prof=normProf(m.prof)}));
const fam=()=>db.families[0];
/* Titles are stored in Hindi; when the name is written in English (Latin letters only) the title is displayed in English too */
const TITLE_EN={'श्री':'Shri','श्रीमती':'Smt.','कुमारी':'Kumari','पंडित श्री':'Pandit Shri','डॉ.':'Dr.'};
const isLatinName=n=>/[A-Za-z]/.test(n||'')&&!/[ऀ-ॿ]/.test(n||'');
const fullName=(t,n)=>[isLatinName(n)&&TITLE_EN[t]||t,n].filter(Boolean).join(' ');
const pName=p=>fullName(p.title,p.name);

/* ===== Form helpers ===== */
const opts=(l,s,ph)=>`<option value="">${ph||'-- चुनें --'}</option>`+l.map(x=>`<option${x===s?' selected':''}>${esc(x)}</option>`).join('');
const radios=(n,l,s)=>l.map(x=>`<label><input type="radio" name="${n}" value="${x}"${x===s?' checked':''}> ${x}</label>`).join('');
const fld=(lab,n,inner,req,cls)=>`<div class="${cls||''}"><label for="${n}">${lab}${req?' <span style="color:var(--er)">*</span>':''}</label>${inner}<span class="err" id="e_${n}" role="alert"></span></div>`;
const inp=(n,v,t,x)=>`<input type="${t||'text'}" id="${n}" name="${n}" value="${esc(v)}" ${x||''}>`;
const TITLES_M=['श्री','पंडित श्री','डॉ.'],TITLES_F=['श्रीमती','कुमारी','डॉ.'];   // father: no female titles, mother: no male titles
const splitName=n=>{n=String(n||'').trim();const i=n.lastIndexOf(' ');return i<0?[n,'']:[n.slice(0,i).trim(),n.slice(i+1).trim()]};
const joinName=(a,b)=>[a,b].map(x=>String(x||'').trim()).filter(Boolean).join(' ');
/* The combined full name stays in a hidden field (name=nn) so saving/validation/autofill/export work as before;
   the visible fields are First name + Last name (no name attr, so they are not saved separately). */
const titleName=(lab,tn,nn,p,req,list)=>{const[fn,ln]=splitName(p[nn]);
  return fld(lab,nn,`<div class="row"><select name="${tn}" aria-label="उपाधि">${opts(list||TITLES,p[tn],'उपाधि')}</select><input type="text" id="${nn}_f" data-np="${nn}" value="${esc(fn)}" placeholder="पहला नाम" aria-label="पहला नाम"><input type="text" id="${nn}_l" data-np="${nn}" value="${esc(ln)}" placeholder="अंतिम नाम" aria-label="अंतिम नाम">${inp(nn,joinName(fn,ln),'hidden')}</div>`,req).replace(`for="${nn}"`,`for="${nn}_f"`)};
const setFullName=(f,k,v)=>{f.elements[k].value=v;const[a,b]=splitName(v);f.elements[k+'_f'].value=a;f.elements[k+'_l'].value=b};
const grp=(lab,n,inner,req,cls)=>`<div class="${cls||''}">${lab?`<span class="lb">${lab}${req?' <span style="color:var(--er)">*</span>':''}</span>`:''}<div class="rd" role="group"${lab?'':` aria-label="${n==='fstatus'?'पिता की स्थिति':'माता की स्थिति'}"`}>${inner}</div><span class="err" id="e_${n}" role="alert"></span></div>`;

/* ===== Person form (role: mukhiya | member) ===== */
function addrFields(p,M,o){
  const L=(n,t)=>(n+o)+'. '+t,R=M?1:0;   // mukhiya: every field required; member: only city is required. All numbered (member numbers are shifted by 1)
  return fld(L(8,'पूरा पता'),'address',`<textarea id="address" name="address" rows="2">${esc(p.address)}</textarea>`,R,'full')+
    fld(L(9,'शहर / गाँव'),'city',inp('city',p.city),1)+
    fld(L(10,'पिन कोड'),'pin',inp('pin',p.pin,'text','inputmode="numeric" maxlength="6"'),R)+
    fld(L(11,'राज्य'),'state',`<select id="state" name="state"></select>`,R)+
    fld(L(12,'जिला'),'district',`<select id="district" name="district"></select>`,R)+
    fld('जिला का नाम लिखें','districtOther',inp('districtOther',''),1,'hid" data-s="dt')+
    fld(L(13,'तहसील / तालुका / ब्लॉक'),'tehsil',`<select id="tehsil" name="tehsil"></select>`,R)+
    fld('तहसील / तालुका / ब्लॉक का नाम लिखें','tehsilOther',inp('tehsilOther',''),1,'hid" data-s="tt');
}
/* Dates are typed and shown as DD/MM/YYYY (older saved YYYY-MM-DD values are converted) */
const toDMY=d=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(d||'');return m?`${m[3]}/${m[2]}/${m[1]}`:(d||'')};
const parseDMY=t=>{const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);if(!m)return null;const da=+m[1],mo=+m[2],y=+m[3],d=new Date(y,mo-1,da);return d.getFullYear()===y&&d.getMonth()===mo-1&&d.getDate()===da?d:null};
function personForm(p,role){
  const M=role==='mukhiya',o=M?0:1,N=(n,t)=>(n+o)+'. '+t;   // question numbers; the member form starts with 1 = "related to which member"
  const others=fam()?fam().members.filter(x=>x.id!==p.id):[];
  if(!M&&p.relation&&p.relV!=='2'){const mk0=fam()?.members.find(x=>x.role==='mukhiya');p={...p,relTo:mk0?mk0.id:''}}   // old records: relation was always to the mukhiya
  const rel=M?'':`<h2>संबंध विवरण</h2><div class="g">`+
    fld('1. किस सदस्य से संबंधित है?','relTo',`<select id="relTo" name="relTo">${opts([],'','-- सदस्य चुनें --')}${others.map(o=>`<option value="${esc(o.id)}"${o.id===p.relTo?' selected':''}>${esc(pName(o))}${o.role==='mukhiya'?' (मुखिया)':''}</option>`).join('')}</select>`,1)+
    fld('यह व्यक्ति चुने गए उपरोक्त सदस्य का/की…','relation',`<select id="relation" name="relation">${opts(RELS,p.relation)}</select>`,1,'hid" data-s="rt')+
    fld('अन्य संबंध लिखें','relOther',inp('relOther',p.relOther),1,'hid" data-s="ro')+'</div>';
  let h='<form id="pf" novalidate class="card">'+rel+`<h2${M?'':' style="margin-top:18px"'}>${M?'मुखिया का विवरण':'सदस्य का विवरण'}</h2><div class="g">`;
  h+=titleName(N(1,M?'पूरा नाम':'नाम और उपाधि'),'title','name',p,1);
  h+=grp(N(2,'लिंग'),'gender',radios('gender',['पुरुष','महिला'],p.gender),1);
  h+=fld(N(3,'जन्म तिथि'),'dob',inp('dob',toDMY(p.dob),'text','inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY" autocomplete="off"'),1);
  h+=fld(N(4,'वैवाहिक स्थिति'),'marital',`<select id="marital" name="marital">${opts(['अविवाहित','विवाहित','तलाकशुदा','विधवा/विधुर'],p.marital)}</select>`,M);
  h+=fld('विवाह की तिथि','marriage',inp('marriage',toDMY(p.marriage),'text','inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY" autocomplete="off"'),1,'hid" data-s="dm');
  h+=titleName(N(5,'पिता का नाम'),'ftitle','fname',p,M,TITLES_M);
  h+=grp('','fstatus',radios('fstatus',['जीवित','स्वर्गीय'],p.fstatus),0);
  h+=titleName(N(6,'माता का नाम'),'mtitle','mname',p,M,TITLES_F);
  h+=grp('','mstatus',radios('mstatus',['जीवित','स्वर्गीय'],p.mstatus),0);
  h+=fld(N(7,'शाखा (साख)'),'shakha',`<select id="shakha" name="shakha" style="display:none" tabindex="-1" aria-hidden="true"></select><button type="button" id="saakhBtn" aria-haspopup="dialog">🌿 अपनी साख एवं गोत्र चुनें</button><input type="hidden" name="gotra">`,1)+
    fld('शाखा (साख) का नाम लिखें','shakhaOther',inp('shakhaOther',''),1,'hid" data-s="st')+
    fld('गोत्र का नाम लिखें','gotraOther',inp('gotraOther',''),1,'hid" data-s="gt');
  h+='</div>';
  if(M){
    h+=`<h2 style="margin-top:18px">पता विवरण</h2><div class="g">`+addrFields(p,true,0)+
    '</div>';
  } else {
    h+=`<h2 class="ah" style="margin-top:18px"><span>पता विवरण</span><label class="same"><input type="checkbox" id="sameAddr" name="sameAddr"${p.sameAddr==='on'?' checked':''}> मुखिया जैसा ही</label></h2><div class="g" id="addrBox">`+addrFields(p,false,1)+'</div>';
  }
  h+=`<h2 style="margin-top:18px">${M?'संपर्क एवं व्यवसाय':'संपर्क व व्यवसाय (वैकल्पिक)'}</h2><div class="g">`+
    fld(M?'14. व्हाट्सऐप मोबाइल नंबर':N(14,'मोबाइल नंबर'),'phone',inp('phone',p.phone,'tel','inputmode="tel"'),M)+
    fld(N(15,'ईमेल'),'email',inp('email',p.email,'email'),M)+
    fld(N(16,'व्यवसाय / पेशा'),'prof',`<select id="prof" name="prof">${opts(PROFS,p.prof)}</select>`,M)+
    fld('कृपया व्यवसाय लिखें','profOther',inp('profOther',p.profOther),1,'hid" data-s="po')+
    grp('वर्तमान स्थिति','profStatus',radios('profStatus',['Working','Retired'],p.profStatus),1,'hid" data-s="ps')+
    fld('पदनाम / व्यवसाय का नाम / नियोक्ता (वैकल्पिक)','desig',inp('desig',p.desig),0)+
    fld(M?'17. फोटो अपलोड करें':N(17,'फोटो अपलोड करें (वैकल्पिक)'),'photo',`<input type="file" id="photo" accept="image/*" hidden><input type="hidden" name="photo" value="${esc(p.photo)}"><input type="hidden" name="photoKey" value="${esc(p.photoKey||'')}"><div id="pv" style="margin-top:6px"></div>`,M,'full')+
    fld('अतिरिक्त जानकारी (वैकल्पिक)','notes',`<textarea id="notes" name="notes" rows="2">${esc(p.notes)}</textarea>`,0,'full')+'</div>';
  h+=`<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button type="submit" class="p" style="flex:1">Save Details</button>${fam()?`<button type="button" id="cancel">Cancel</button>`:''}${editId&&!M?`<button type="button" data-del="${esc(editId)}" style="color:var(--er);border-color:var(--er)">Delete member</button>`:''}</div></form>`+(M?'<p style="text-align:center;margin:0 0 8px"><button type="button" class="lnk" id="instrBtn">Read Instructions again</button></p>':'');
  return h;
}

/* Show/hide conditional fields */
function syncForm(f){
  const g=n=>f.elements[n]?.value||'', tog=(k,on)=>f.querySelector(`[data-s="${k}"]`)?.classList.toggle('hid',!on);
  tog('po',g('prof')==='Other');
  tog('ps',PROF_ST.includes(g('prof')));
  tog('dm',g('marital')==='विवाहित');
  [['district','dt'],['tehsil','tt'],['shakha','st'],['shakha','gt']].forEach(([n,k])=>{if(f.elements[n])tog(k,g(n)===OTHER)});
  if(f.elements.relation){tog('rt',!!g('relTo'));tog('ro',!!g('relTo')&&g('relation')==='अन्य संबंध')}
}

/* ===== Cascading dropdowns: State → District → Tehsil, and Gotra ⇄ Saakh ===== */
const optHTML=(list,ph)=>`<option value="">${ph}</option>`+list.map(x=>`<option>${esc(x)}</option>`).join('')+OTHER_OPT;
const SAAKH_LIST=Object.keys(SAAKH_GOTRA).sort((x,y)=>x.localeCompare(y));
const saakhLabel=(x,g)=>x?x+((g||SAAKH_GOTRA[x])?' ('+(g||SAAKH_GOTRA[x])+')':''):'';   // Palod (Gautam)
const shakhaHTML=()=>'<option value="">-- साख चुनें --</option>'+SAAKH_LIST.map(x=>`<option value="${esc(x)}">${esc(saakhLabel(x))}</option>`).join('')+OTHER_OPT;
/* Fill one dropdown; a saved value missing from the list is shown as "other" with its text */
function setLevel(f,name,html,list,cur){
  const sel=f.elements[name],oth=f.elements[name+'Other'];
  sel.innerHTML=html;
  if(cur===OTHER){sel.value=OTHER;return}
  if(cur&&list.includes(cur)){sel.value=cur;oth.value=''}
  else if(cur){sel.value=OTHER;oth.value=cur}
  else oth.value='';
}
/* name: 'init' (first render, c = saved record) | 'state' | 'district' | 'gotra' | 'shakha' */
function locChange(f,name,c){
  const v=n=>f.elements[n].value,init=name==='init'||name==='addr';c=c||{};   // 'addr' = refresh State/District/Tehsil only (used by "same as mukhiya")
  if(init){
    f.elements.state.innerHTML='<option value="">-- राज्य चुनें --</option>'+STATES.map(x=>`<option value="${esc(x)}">${esc(stateLabel(x))}</option>`).join('');
    f.elements.state.value=normState(c.state);
  }
  if(init||name==='state'){
    const l=DIST[v('state')]||[];
    setLevel(f,'district',optHTML(l,'-- जिला चुनें --'),l,init?c.district:'');
  }
  if(init||name==='state'||name==='district'){
    const d=v('district'),l=(TEH[v('state')]||{})[d]||[];
    setLevel(f,'tehsil',optHTML(l,d&&d!==OTHER?'-- तहसील / तालुका / ब्लॉक चुनें --':'-- पहले जिला चुनें --'),l,init?c.tehsil:'');
  }
  if(f.elements.shakha&&(name==='init'||name==='shakha')){
    if(init)setLevel(f,'shakha',shakhaHTML(),SAAKH_LIST,c.shakha);
    const s=v('shakha');
    // gotra follows the saakh automatically; for an "other" saakh it is typed by the user
    saakhBtnSync(f);
    if(SAAKH_GOTRA[s]){f.elements.gotra.value=SAAKH_GOTRA[s];f.elements.gotraOther.value=''}
    else{f.elements.gotra.value='';if(init&&s===OTHER||init&&c.shakha&&!SAAKH_GOTRA[c.shakha])f.elements.gotraOther.value=c.gotra||''}
  }
}

/* Member address: copy from mukhiya when "same as mukhiya" is ticked */
function sameAddrSync(f){
  const cb=f.elements.sameAddr,box=f.querySelector('#addrBox');if(!cb||!box)return;
  const on=cb.checked,mk=fam()?.members.find(x=>x.role==='mukhiya');
  if(on&&mk){
    locChange(f,'addr',mk);
    ['address','city','pin'].forEach(k=>f.elements[k].value=mk[k]||'');
    syncForm(f);
    box.querySelectorAll('.err').forEach(e=>e.textContent='');box.querySelectorAll('.bad').forEach(e=>e.classList.remove('bad'));
  }
  box.toggleAttribute('inert',on);box.setAttribute('aria-disabled',on);
}

/* ===== Smart autofill of Q5 / Q6 (parents) from saved records ===== */
function spouseOf(R){
  const ms=fam().members,SP=['पति','पत्नी'];
  let s=ms.find(m=>m.id!==R.id&&SP.includes(m.relation)&&(m.relTo===R.id||(R.role==='mukhiya'&&m.role==='member'&&m.relV!=='2')));
  if(!s&&SP.includes(R.relation)){const ref=R.relV==='2'?ms.find(m=>m.id===R.relTo):ms.find(m=>m.role==='mukhiya');if(ref&&ref.id!==R.id)s=ref}
  if(s)return{title:s.title,name:s.name,shakha:s.shakha,gotra:s.gotra};
  return R.spouse?{title:'',name:R.spouse}:null;
}
/* A person's saakh is always the same as his/her father's. The saakh of a new member is taken from the
   related member whenever that member is the father, a child's father (R or R's husband), or a sibling
   (same father). In those cases the saakh is filled in automatically and locked. */
function saakhSource(f){
  const g=n=>f.elements[n]?.value||'',R=fam()?.members.find(x=>x.id===g('relTo')),rel=g('relation');
  if(!R||!rel)return null;
  let src=null;
  if(rel==='पुत्र'||rel==='पुत्री'){
    if(R.gender==='पुरुष')src=R;else if(R.gender==='महिला')src=spouseOf(R);
  }else if(rel==='भाई'||rel==='बहन'||rel==='पिता')src=R;
  return src&&src.shakha?{sh:src.shakha,gt:src.gotra||''}:null;
}
function saakhLock(f){
  if(!f.elements.shakha||!f.elements.relTo)return;
  const s=saakhSource(f),sel=f.elements.shakha,b=f.querySelector('#saakhBtn');
  if(s){
    if(SAAKH_GOTRA[s.sh]){sel.value=s.sh;f.elements.shakhaOther.value='';f.elements.gotraOther.value=''}
    else{sel.value=OTHER;f.elements.shakhaOther.value=s.sh;f.elements.gotraOther.value=s.gt}
    locChange(f,'shakha');
  }
  if(b){b.disabled=!!s;b.title=s?'साख पिता की साख के अनुसार स्वतः भरी गई है':''}
  ['shakhaOther','gotraOther'].forEach(n=>{if(f.elements[n])f.elements[n].readOnly=!!s});
  syncForm(f);
}
function autoParents(f){
  const g=n=>f.elements[n]?.value||'',R=fam()?.members.find(x=>x.id===g('relTo')),rel=g('relation');
  if(!R||!rel)return;
  /* Autofill only fills empty fields, or fields still holding what autofill itself wrote earlier.
     Anything typed by the user, or already saved on this member, is never overwritten. */
  const au=f._au=f._au||{};
  const setP=(k,t,n,st)=>{if(!n)return;const nm=f.elements[k+'name'];if(nm.value&&nm.value!==au[k+'name'])return;
    f.elements[k+'title'].value=t||'';setFullName(f,k+'name',n);au[k+'name']=n;
    const r=f.querySelector(`[name=${k}status][value="${st||'जीवित'}"]`);if(r)r.checked=true};
  if(rel==='पुत्र'||rel==='पुत्री'){            // new person is the child of R: father/mother = R and R's spouse
    if(R.gender!=='पुरुष'&&R.gender!=='महिला')return;
    const me={title:R.title,name:R.name},sp=spouseOf(R),male=R.gender==='पुरुष',a=male?me:sp,b=male?sp:me;
    if(a)setP('f',a.title,a.name,'जीवित');if(b)setP('m',b.title,b.name,'जीवित');
  }else if(rel==='भाई'||rel==='बहन'){          // siblings share R's parents
    setP('f',R.ftitle,R.fname,R.fstatus);setP('m',R.mtitle,R.mname,R.mstatus);
  }else if(rel==='पिता'||rel==='माता'){         // new person is R's parent: take own name from R's saved father/mother
    const k=rel==='पिता'?'f':'m',nm=f.elements.name;
    if(R[k+'name']&&(!nm.value||nm.value===au.name)){f.elements.title.value=R[k+'title']||'';setFullName(f,'name',R[k+'name']);au.name=nm.value}
  }
}

/* ===== Saakh picker pop-up (bottom sheet, chips grouped by gotra) ===== */
function saakhBtnSync(f){
  const b=f.querySelector('#saakhBtn');if(!b)return;const s=f.elements.shakha.value;
  b.classList.toggle('set',!!s);
  b.textContent=!s?'🌿 अपनी साख एवं गोत्र चुनें':s===OTHER?'🌿 अन्य (सूची में नहीं है) – बदलें':'🌿 '+saakhLabel(s)+' – बदलें';
}
let skPick=null;
function skEnsure(){
  if($('#sk-modal'))return;
  const d=document.createElement('div');d.className='sk-ov';d.id='sk-modal';
  d.innerHTML=`<div class="sk-sheet" role="dialog" aria-modal="true" aria-labelledby="sk-t"><div class="sk-handle"></div>
  <div class="sk-title" id="sk-t">🌿 Select Your Saakh</div>
  <div class="sk-sub">Your Saakh identifies your Rishi Gotra lineage. Please select yours from the list below.</div>
  <div id="sk-list"></div>
  <button type="button" class="sk-ok" id="sk-ok" disabled>Confirm My Saakh</button></div>`;
  document.body.appendChild(d);
  d.addEventListener('click',e=>{
    if(e.target===d){d.classList.remove('open');return}
    const c=e.target.closest('.sk-chip');
    if(c){d.querySelectorAll('.sk-chip').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');skPick=c.dataset.s;$('#sk-ok').disabled=false}
    if(e.target.id==='sk-ok'&&skPick){
      const f=$('#pf');f.elements.shakha.value=skPick;
      f.elements.shakha.dispatchEvent(new Event('change',{bubbles:true}));
      d.classList.remove('open');f.querySelector('#saakhBtn')?.focus();
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')d.classList.remove('open')});
}
function skOpen(f){
  skEnsure();skPick=f.elements.shakha.value||null;
  const ch=(s,t)=>`<button type="button" class="sk-chip${skPick===s?' sel':''}" data-s="${esc(s)}">${esc(t)}</button>`;
  $('#sk-list').innerHTML=Object.entries(GOTRA).sort((a,b)=>a[0].localeCompare(b[0])).map(([g,l])=>`<div class="sk-sec"><div class="sk-gn">${esc(g)} Gotra</div><div class="sk-chips">${[...l].sort((x,y)=>x.localeCompare(y)).map(x=>ch(x,x)).join('')}</div></div>`).join('')
    +`<div class="sk-sec"><div class="sk-gn">Other</div><div class="sk-chips">${ch(OTHER,'अन्य (सूची में नहीं है)')}</div></div>`;
  $('#sk-ok').disabled=!skPick;
  $('#sk-modal').classList.add('open');
}

/* ===== Photo upload: resized to max 420px JPEG and stored as data URL ===== */
const CR=300;   // on-screen crop square (px); saved photo is 420x420 JPEG
let crSt=null;
function crEnsure(){
  if($('#cr-modal'))return;
  const d=document.createElement('div');d.className='sk-ov';d.id='cr-modal';
  d.innerHTML=`<div class="sk-sheet" role="dialog" aria-modal="true" aria-labelledby="cr-t"><div class="sk-handle"></div>
  <div class="sk-title" id="cr-t">✂️ फोटो क्रॉप और ज़ूम करें</div>
  <div class="sk-sub">फोटो को खींचकर सही जगह रखें और स्लाइडर / पिंच से ज़ूम करें। गोल घेरे के अंदर का भाग सेव होगा।</div>
  <canvas id="cr-cv" width="${CR}" height="${CR}"></canvas>
  <div class="cr-z"><button type="button" id="cr-m" aria-label="ज़ूम कम करें">−</button><input type="range" id="cr-r" min="1" max="4" step="0.01" value="1" aria-label="ज़ूम"><button type="button" id="cr-p" aria-label="ज़ूम बढ़ाएँ">+</button></div>
  <div class="cr-act"><button type="button" id="cr-x">रद्द करें</button><button type="button" class="p" id="cr-ok">फोटो सेव करें</button></div></div>`;
  document.body.appendChild(d);
  const cv=$('#cr-cv'),pts=new Map();let pd=0;
  const move=(dx,dy)=>{crSt.ox+=dx;crSt.oy+=dy;crDraw()};
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);pd=0});
  cv.addEventListener('pointermove',e=>{
    if(!pts.has(e.pointerId)||!crSt)return;const o=pts.get(e.pointerId),k=CR/cv.getBoundingClientRect().width;
    pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1)move((e.clientX-o[0])*k,(e.clientY-o[1])*k);
    else if(pts.size===2){const [a,b]=[...pts.values()],dd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pd)crZoom(crSt.z*dd/pd);pd=dd}
  });
  const up=e=>{pts.delete(e.pointerId);pd=0};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();crZoom(crSt.z*(e.deltaY<0?1.08:1/1.08))},{passive:false});
  $('#cr-r').addEventListener('input',e=>crZoom(+e.target.value));
  $('#cr-m').addEventListener('click',()=>crZoom(crSt.z-.25));$('#cr-p').addEventListener('click',()=>crZoom(crSt.z+.25));
  $('#cr-x').addEventListener('click',()=>crClose(false));
  $('#cr-ok').addEventListener('click',()=>crClose(true));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&d.classList.contains('open'))crClose(false)});
}
function crZoom(z){crSt.z=Math.min(4,Math.max(1,z));$('#cr-r').value=crSt.z;crDraw()}
/* draws the image (cover-fit × zoom) into ctx of size n; offsets are clamped so the square is always filled */
function crPaint(ctx){
  const {img,z}=crSt,sc=CR/Math.min(img.width,img.height)*z,w=img.width*sc,h=img.height*sc;
  const mx=(w-CR)/2,my=(h-CR)/2;crSt.ox=Math.max(-mx,Math.min(mx,crSt.ox));crSt.oy=Math.max(-my,Math.min(my,crSt.oy));
  ctx.drawImage(img,(CR-w)/2+crSt.ox,(CR-h)/2+crSt.oy,w,h);
}
function crDraw(){
  const cv=$('#cr-cv'),x=cv.getContext('2d');x.clearRect(0,0,CR,CR);crPaint(x);
  x.fillStyle='rgba(0,0,0,.55)';x.beginPath();x.rect(0,0,CR,CR);x.arc(CR/2,CR/2,CR/2-6,0,Math.PI*2,true);x.fill('evenodd');
  x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(CR/2,CR/2,CR/2-6,0,Math.PI*2);x.stroke();
}
function crClose(save){
  $('#cr-modal').classList.remove('open');
  if(save&&crSt.done){
    const c=document.createElement('canvas');c.width=c.height=420;const x=c.getContext('2d');x.scale(420/CR,420/CR);crPaint(x);
    const done=crSt.done,url=c.toDataURL('image/jpeg',.85),im=crSt.img,out=Math.max(420,Math.min(1200,Math.round(Math.min(im.width,im.height)/(crSt.z||1))));
    const c2=document.createElement('canvas');c2.width=c2.height=out;const x2=c2.getContext('2d');x2.scale(out/CR,out/CR);crPaint(x2);
    c2.toBlob(b=>done(url,b),'image/jpeg',.92);
  }else if(crSt.cancel)crSt.cancel();
}
function crOpen(img,done,cancel){
  crEnsure();crSt={img,z:1,ox:0,oy:0,done,cancel};$('#cr-r').value=1;crDraw();$('#cr-modal').classList.add('open');
}

const AVATAR='<svg class="ph phl" viewBox="0 0 96 96" role="img" aria-label="फोटो उपलब्ध नहीं"><rect width="96" height="96" fill="#fbeccf"/><circle cx="48" cy="38" r="17" fill="#c9b48a"/><path d="M12 96c0-20 16-33 36-33s36 13 36 33z" fill="#c9b48a"/></svg>';
function photoInit(f){
  const hid=f.querySelector('[name=photo]'),kh=f.querySelector('[name=photoKey]'),setPh=(d,b)=>{hid.value=d;if(b){const k=uid();kh.value=k;IDB.put(k,b).catch(()=>{kh.value=''})}showPv()},err=m=>$('#e_photo').textContent=m;let orig=null;   // orig: last chosen image, for re-cropping
  function showPv(){
    // no photo: blank avatar + "upload photo" button; with photo: the photo + "edit photo" and "remove photo" buttons
    $('#pv').innerHTML='<div class="pvr">'+(hid.value
      ?`<img class="ph phl" src="${esc(hid.value)}" alt="चयनित फोटो"><button type="button" id="rcPh">Edit Photo</button><button type="button" id="rmPh" class="ic" title="Delete photo" aria-label="Delete photo">${SVG.del}</button>`
      :`${AVATAR}<button type="button" id="upPh">फोटो अपलोड करें</button>`)+'</div>';
    $('#upPh')?.addEventListener('click',()=>$('#photo').click());
    $('#rmPh')?.addEventListener('click',()=>{hid.value='';kh.value='';orig=null;$('#photo').value='';showPv()});
    $('#rcPh')?.addEventListener('click',()=>{
      if(orig)return crOpen(orig,setPh);
      (async()=>{let src=hid.value,tmp='';try{const b=kh.value&&await IDB.get(kh.value);if(b)src=tmp=URL.createObjectURL(b)}catch(e){}const im=new Image();im.onload=()=>{if(tmp)URL.revokeObjectURL(tmp);crOpen(im,setPh)};im.src=src})();   // saved photo: edit from the stored copy
    });
  }
  showPv();
  $('#photo').addEventListener('change',e=>{
    const file=e.target.files[0];err('');if(!file)return;
    if(!file.type.startsWith('image/')){err('कृपया केवल फोटो (image) फाइल चुनें।');e.target.value='';return}
    if(file.size>8*1024*1024){err('फोटो 8 MB से छोटी होनी चाहिए।');e.target.value='';return}
    const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{
      // keep a copy of at most 1600px so memory stays small while allowing a sharp crop
      const sc=Math.min(1,1600/Math.max(img.width,img.height)),c=document.createElement('canvas');
      c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
      orig=c;crOpen(c,setPh,()=>{e.target.value=''; if(!hid.value)orig=null;showPv()});
    };
    img.onerror=()=>err('यह फोटो पढ़ी नहीं जा सकी। कृपया दूसरी फोटो चुनें।');
    img.src=url;
  });
}

/* ===== Validation ===== */
function validate(f,role){
  /* Required for everyone: name, gender, date of birth, saakh, city.
     Mukhiya only: marital status, parents, full address, phone, email, occupation, photo.
     Anything else is optional for members, but is still format-checked when filled. */
  const M=role==='mukhiya',errs={},v=n=>(f.elements[n]?.value||'').trim(),r=n=>f.querySelector(`[name=${n}]:checked`)?.value;
  const PIN=/^[1-9][0-9]{5}$/;
  const sel=(n,m1,m2,req)=>{if(!v(n)){if(req)errs[n]=m1}else if(v(n)===OTHER&&!v(n+'Other'))errs[n+'Other']=m2};
  if(!v('name'))errs.name='कृपया नाम दर्ज करें।';
  if(!r('gender'))errs.gender='कृपया लिंग चुनें।';
  if(M&&!v('marital'))errs.marital='कृपया वैवाहिक स्थिति चुनें।';
  if(v('dob')){const d=parseDMY(v('dob'));if(!d)errs.dob='कृपया जन्म तिथि DD/MM/YYYY प्रारूप में सही दर्ज करें।';else if(d>new Date())errs.dob='जन्म तिथि भविष्य की नहीं हो सकती।'}else errs.dob='कृपया जन्म तिथि चुनें।';
  if(v('marital')==='विवाहित'){   // date of marriage is mandatory only for married persons
    if(!v('marriage'))errs.marriage='कृपया विवाह की तिथि दर्ज करें।';
    else{const m=parseDMY(v('marriage'));
      if(!m)errs.marriage='कृपया विवाह की तिथि DD/MM/YYYY प्रारूप में सही दर्ज करें।';
      else if(m>new Date())errs.marriage='विवाह की तिथि भविष्य की नहीं हो सकती।';
      else{const b=parseDMY(v('dob'));if(b&&m<=b)errs.marriage='विवाह की तिथि जन्म तिथि के बाद की होनी चाहिए।'}}
  }
  if(M){
    if(!v('fname'))errs.fname='कृपया पिता का नाम दर्ज करें।';
    if(!v('mname'))errs.mname='कृपया माता का नाम दर्ज करें।';
  }
  sel('shakha','कृपया शाखा (साख) चुनें।','कृपया शाखा (साख) का नाम लिखें।',1);
  if(v('shakha')===OTHER&&!v('gotraOther'))errs.gotraOther='कृपया गोत्र का नाम लिखें।';
  if(M&&!v('address'))errs.address='कृपया पूरा पता दर्ज करें।';
  if(!v('city'))errs.city='कृपया शहर / गाँव दर्ज करें।';
  if((M||v('pin'))&&!PIN.test(v('pin')))errs.pin='कृपया सही 6 अंकों का पिन कोड दर्ज करें।';
  if(M&&!v('state'))errs.state='कृपया राज्य चुनें।';
  sel('district','कृपया जिला चुनें।','कृपया जिला का नाम लिखें।',M);
  sel('tehsil','कृपया तहसील / तालुका / ब्लॉक चुनें।','कृपया तहसील / तालुका / ब्लॉक का नाम लिखें।',M);
  if(M){
    if(!v('phone'))errs.phone='कृपया मोबाइल नंबर दर्ज करें।';
    if(!v('email'))errs.email='कृपया ईमेल दर्ज करें।';
    if(!v('prof'))errs.prof='कृपया व्यवसाय चुनें।';
    if(!f.querySelector('[name=photo]').value)errs.photo='कृपया मुखिया की फोटो अपलोड करें।';
  }
  if(role==='member'){
    if(!v('relTo'))errs.relTo='कृपया चुनें कि यह सदस्य किस सदस्य से संबंधित है।';
    else if(!v('relation'))errs.relation='कृपया संबंध चुनें।';
    if(v('relation')==='अन्य संबंध'&&!v('relOther'))errs.relOther='कृपया संबंध लिखें।';
    {const g=r('gender'),rl=v('relation');
     if(!errs.relation&&g&&((g==='पुरुष'&&RELF.has(rl))||(g==='महिला'&&RELM.has(rl))))errs.relation='चुना गया संबंध और लिंग मेल नहीं खाते। कृपया जाँचें।';}
    if(editId&&v('relTo')&&!errs.relTo){let c=v('relTo'),n=0;while(c&&n++<50){if(c===editId){errs.relTo='यह चुनाव एक चक्र बनाता है (चुना सदस्य पहले से इसी सदस्य से जुड़ा है)।';break}c=(fam().members.find(x=>x.id===c)||{}).relTo}}
  }
  if(v('phone')&&!/^(\+91[\s-]?)?[6-9][0-9]{9}$/.test(v('phone')))errs.phone='कृपया सही 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें (+91 वैकल्पिक)।';
  if(v('email')&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')))errs.email='कृपया सही ईमेल दर्ज करें।';
  if(v('prof')==='Other'&&!v('profOther'))errs.profOther='कृपया व्यवसाय लिखें।';
  if(PROF_ST.includes(v('prof'))&&!r('profStatus'))errs.profStatus='कृपया चुनें: Working या Retired।';
  return errs;
}

/* ===== Save (add / edit, no duplicates) ===== */
let saving=false;
function submitPerson(f,role){
  if(saving)return;
  saving=true;
  try{savePerson(f,role)}finally{saving=false}
}
function savePerson(f,role){
  f.querySelectorAll('.err').forEach(e=>e.textContent='');f.querySelectorAll('.bad').forEach(e=>e.classList.remove('bad'));
  const errs=validate(f,role),keys=Object.keys(errs);
  if(keys.length){keys.forEach(k=>{$('#e_'+k).textContent=errs[k];(f.elements[k+'_f']||f.elements[k])?.classList?.add('bad')});
    // jump to the first error as it appears on the page (not in the order the checks ran)
    const firstKey=keys.map(k=>$('#e_'+k)).sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)[0].id.slice(2);
    // the real saakh <select> is hidden, so use its visible button
    const t=firstKey==='shakha'?$('#saakhBtn'):(f.elements[firstKey+'_f']||f.elements[firstKey]);
    (t?.focus?t:$('#e_'+firstKey)).scrollIntoView({block:'center'});t?.focus?.();return}
  const bak=JSON.stringify(db);   // snapshot so a failed save can be undone
  const d={};new FormData(f).forEach((val,k)=>d[k]=String(val).trim());
  {if(d.marital!=='विवाहित')d.marriage='';if(d.prof!=='Other')d.profOther='';d.profStatus=PROF_ST.includes(d.prof)?(d.profStatus||''):'';d.gotra=d.shakha===OTHER?d.gotraOther:(SAAKH_GOTRA[d.shakha]||'');delete d.gotraOther;['district','tehsil','shakha'].forEach(k=>{if(d[k]===OTHER)d[k]=d[k+'Other'];delete d[k+'Other']})}
  if(role==='member'){if(d.relation!=='अन्य संबंध')d.relOther='';d.relToRel='';d.relV='2';
    d.sameAddr=d.sameAddr?'on':'';
    if(d.sameAddr){const mk=fam().members.find(x=>x.role==='mukhiya');if(mk)['address','city','pin','state','district','tehsil'].forEach(k=>d[k]=mk[k]||'')}}
  if(role==='mukhiya'){
    if(!db.families.length)db.families.push({id:uid(),createdAt:new Date().toISOString(),members:[]});
    const mk=fam().members.find(x=>x.role==='mukhiya');
    if(mk)Object.assign(mk,d);else fam().members.unshift({id:uid(),role:'mukhiya',...d});
    flash=editId?'मुखिया का विवरण सफलतापूर्वक अपडेट हो गया।':'मुखिया का विवरण सफलतापूर्वक सुरक्षित हो गया।';
  } else {
    const ex=editId&&fam().members.find(x=>x.id===editId);
    if(ex)Object.assign(ex,d);else fam().members.push({id:uid(),role:'member',familyId:fam().id,...d});
    flash=ex?'सदस्य का विवरण अपडेट हो गया।':'नया सदस्य जोड़ दिया गया।';
  }
  if(!Store.save(db)){db=JSON.parse(bak);flash='';return}   // not saved: undo the change and keep the form open
  editId=null;view='dash';render();
}

/* ===== Dashboard ===== */
function relText(p){
  if(p.role==='mukhiya')return'<span class="tag">मुखिया</span>';
  let s=p.relation==='अन्य संबंध'?(p.relOther||'अन्य संबंध'):p.relation;
  if(!s)return'—';
  const ref=p.relV==='2'?fam().members.find(x=>x.id===p.relTo):null;
  return ref&&ref.role!=='mukhiya'?`${esc(pName(ref))} ${ke(s)} ${esc(s)}`:`मुखिया ${ke(s)} ${esc(s)}`;
}
function dash(){
  const f=fam(),mk=f.members.find(x=>x.role==='mukhiya'),n=f.members.length;
  let h=flash?`<div class="ok" role="status">${flash}</div>`:'';flash='';
  const stc=SC[normState(mk.state)]||'';
  const sm=(a,b)=>String(a||'').trim().toLowerCase()===String(b||'').trim().toLowerCase();   // same name (ignoring case)
  const loc=[[mk.city,mk.tehsil&&sm(mk.tehsil,mk.city)?'':mk.tehsil&&mk.tehsil+' Teh.',mk.district&&sm(mk.district,mk.city)?'':mk.district&&mk.district.toUpperCase()+' Dist.'].filter(Boolean).map(esc).join(', '),stc?'('+stc+')':''].filter(Boolean).join(' ');
  const PIN='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  h+=`<div class="fh">${esc(pName(mk))}<br>का परिवार</div><section class="card mk"><div class="mk-h">मुखिया</div><div class="mk-b">${mk.photo?`<img class="mk-ph" src="${esc(mk.photo)}" alt="मुखिया की फोटो">`:AVATAR.replace('class="ph phl"','class="mk-ph"')}<div class="mk-i"><div class="mk-n">${esc(pName(mk))}</div><div class="mk-p">${esc(profText(mk))}</div>${loc?`<div class="mk-l">${PIN}${loc}</div>`:''}<div class="mk-l mk-sg"><span>साख: ${esc(mk.shakha)}</span><span>गोत्र: ${esc(mk.gotra||SAAKH_GOTRA[mk.shakha]||'')}</span></div></div></div></section>
  <section class="card"><h2 style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span>परिवार के सभी सदस्यों की सूची</span><span style="font-size:.85em;font-weight:600;white-space:nowrap;color:var(--tx)">कुल ${n}</span></h2>`;
  h+=`<div class="tw"><table><thead><tr><th>नाम</th><th>संबंध</th><th>कार्य</th></tr></thead><tbody>`+f.members.map(p=>{
    return`<tr><td><div class="nm">${p.photo?`<img class="ph" src="${esc(p.photo)}" alt="${esc(pName(p))} की फोटो">`:'<span class="ph" style="display:inline-block;background:#fbeccf" aria-hidden="true"></span>'}<b>${esc(pName(p))}</b></div></td><td>${relText(p)}</td>
    <td><button class="ic" data-ed="${esc(p.id)}" title="संपादित करें" aria-label="${esc(pName(p))} का विवरण संपादित करें">${SVG.edit}</button></td></tr>`}).join('')+'</tbody></table></div>';
  return h+'<div class="bar"><button class="p" id="addM">+ परिवार का सदस्य जोड़ें</button></div></section>'+submitHtml()+'<p style="text-align:center;margin:0 0 8px"><button type="button" class="lnk" id="instrBtn">Read Instructions again</button></p><p style="text-align:center;margin:16px 0 8px;font-size:.72rem;opacity:.8">Developed by Abhishek Dadhich <a href="tel:+919828663770">9828663770</a></p>';
}


/* ===== Photo originals (IndexedDB): small display copy stays in db, full-size crop is kept here for sharing ===== */
const IDB={db:null,open(){return this.db||(this.db=new Promise((res,rej)=>{const r=indexedDB.open('ddh_photos',1);r.onupgradeneeded=()=>r.result.createObjectStore('p');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}))},
  async tx(mode,fn){const d=await this.open();return new Promise((res,rej)=>{const t=d.transaction('p',mode),r=fn(t.objectStore('p'));t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)})},
  put(k,v){return this.tx('readwrite',s=>s.put(v,k))},get(k){return this.tx('readonly',s=>s.get(k))},del(k){return this.tx('readwrite',s=>s.delete(k))},keys(){return this.tx('readonly',s=>s.getAllKeys())}};
async function gcPhotos(){try{const used=new Set(db.families.flatMap(f=>f.members.map(p=>p.photoKey)).filter(Boolean));for(const k of await IDB.keys())if(!used.has(k))await IDB.del(k)}catch(e){}}

/* ===== Hindi -> simple English spelling (for file names; approximate) ===== */
const CONS={};'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह'.split('').forEach((c,i)=>CONS[c]='k,kh,g,gh,n,ch,chh,j,jh,n,t,th,d,dh,n,t,th,d,dh,n,p,ph,b,bh,m,y,r,l,v,sh,sh,s,h'.split(',')[i]);
Object.assign(CONS,{'\u0958':'k','\u0959':'kh','\u095a':'g','\u095b':'z','\u095c':'r','\u095d':'rh','\u095e':'f'});
const VOW={'अ':'a','आ':'a','इ':'i','ई':'ee','उ':'u','ऊ':'oo','ऋ':'ri','ए':'e','ऐ':'ai','ओ':'o','औ':'au'};
const MAT={'ा':'a','ि':'i','ी':'ee','ु':'u','ू':'oo','ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au','ॉ':'o','ॅ':'e'};
function trWord(w){const u=[];let i=0;
  while(i<w.length){const c=w[i];
    if(CONS[c]!==undefined){let r=CONS[c];i++;if(w[i]==='\u093c')i++;
      while(w[i]==='\u094d'&&CONS[w[i+1]]!==undefined){r+=CONS[w[i+1]];i+=2;if(w[i]==='\u093c')i++}
      if(r==='jn')r='gy';
      if(w[i]==='\u094d'){i++;u.push({r,inh:false})}
      else if(MAT[w[i]]!==undefined){u.push({r:r+MAT[w[i]],inh:false});i++}
      else u.push({r,inh:true})}
    else if(VOW[c]!==undefined){u.push({r:VOW[c],inh:false});i++}
    else if(c==='ं'||c==='ँ'||c==='ः'){const l=u[u.length-1];if(l){if(l.inh){l.r+='a';l.inh=false}l.r+=c==='ः'?'h':'n'}i++}
    else i++}
  return u.map((x,k)=>x.inh&&k<u.length-1&&!(k>0&&!u[k+1].inh)?x.r+'a':x.r).join('')}
const enName=s=>String(s||'').replace(/[\u0900-\u097F]+/g,m=>trWord(m)+' ').replace(/[^A-Za-z0-9 ]/g,'').split(/\s+/).filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');

/* ===== Submit info: ZIP (Excel + photos) shared via WhatsApp ===== */
const WA_NO='919413843202';
const WA_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
const CONSENT='मैं उपरोक्त समस्त जानकारी दर्ज करने तथा इसे किसी प्रकार से साझा करने, प्रकाशित करने की सहमति प्रदान करता/करती हूँ।';
const XCOLS=['role','title','name','gender','dob','ftitle','fname','fstatus','mtitle','mname','mstatus','address','city','pin','state','district','tehsil','gotra','shakha','phone','email','prof','profOther','profStatus','desig','relation','relOther','relTo','marital','marriage','notes'];
const mobOf=p=>String(p?.phone||'').replace(/\D/g,'').slice(-10);
const mkOf=()=>fam().members.find(x=>x.role==='mukhiya');
function submitHtml(){
  const f=fam(),ok=mobOf(mkOf()).length===10;setTimeout(gcPhotos,0);
  return`<section class="card" style="text-align:center"><p style="margin:0 0 8px">उपरोक्त जानकारी दाधीच समाज अध्यक्ष श्री रमेश चंद्र दाधीच से WhatsApp पर शेयर करें</p><div class="bar" style="justify-content:center"><button class="p wa" id="subBtn"${ok?'':' disabled'}>${WA_ICON}${f.submitted?'Reshare':'Share'}</button></div>${f.submitted?`<p style="margin:4px 0">✅ Submitted on ${new Date(f.submitted.at).toLocaleDateString('en-IN')}</p>`:''}${ok?'':'<p style="margin:4px 0;font-size:.85rem">जानकारी भेजने के लिए मुखिया का 10 अंकों का मोबाइल नंबर आवश्यक है।</p>'}</section>`}
/* JSZip is only needed for sharing: load it on demand (self-hosted, same origin) instead of on every page view */
const LIBS=['jszip.min.js'];
let libsP=null;
const loadLibs=()=>libsP||(libsP=Promise.all(LIBS.map(u=>new Promise((ok,no)=>{if(window.JSZip)return ok();const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=()=>{s.remove();no(new Error('lib'))};document.head.appendChild(s)}))).catch(e=>{libsP=null;throw e}));
/* Minimal .xlsx writer (replaces SheetJS): inline-string cells only, so values are never interpreted as formulas */
const xEsc=v=>String(v).replace(/[^\t\n\r\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const xCol=i=>{let s='';for(i++;i>0;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s};
const xSheet=aoa=>'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+aoa.map((r,y)=>`<row r="${y+1}">`+r.map((v,x)=>{const ref=xCol(x)+(y+1);return v===''||v==null?'':typeof v==='number'&&isFinite(v)?`<c r="${ref}"><v>${v}</v></c>`:`<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xEsc(v)}</t></is></c>`}).join('')+'</row>').join('')+'</sheetData></worksheet>';
async function xlsxBuild(sheets){   // sheets: [[name, aoa], ...] -> Uint8Array
  const z=new JSZip(),H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',N=sheets.length;
  z.file('[Content_Types].xml',H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>');
  z.file('_rels/.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
  z.file('xl/workbook.xml',H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+sheets.map(([n],i)=>`<sheet name="${xEsc(n)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>');
  z.file('xl/_rels/workbook.xml.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+'</Relationships>');
  sheets.forEach(([,aoa],i)=>z.file(`xl/worksheets/sheet${i+1}.xml`,xSheet(aoa)));
  return z.generateAsync({type:'uint8array',compression:'DEFLATE'})}
async function buildZip(){
  await loadLibs();
  const f=fam(),mk=mkOf(),mob=mobOf(mk),n=(f.submitted?.n||0)+1,zip=new JSZip(),used={},rows=[];
  let i=0;
  for(const p of f.members){i++;let file='';
    if(p.photo){let b=null;try{b=p.photoKey&&await IDB.get(p.photoKey)}catch(e){}
      if(!(b instanceof Blob))b=null;   // missing or unreadable original: fall back to the saved copy
      if(!b)b=await(await fetch(p.photo)).blob();
      const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/heic':'heic'}[b.type]||'jpg';
      let base=`${mob}_${enName(p.name).replace(/ /g,'_')||'Member_'+i}`;used[base]=(used[base]||0)+1;if(used[base]>1)base+='_'+used[base];
      file=`${base}.${ext}`;zip.file(file,b)}
    rows.push([i,...XCOLS.map(k=>k==='dob'||k==='marriage'?toDMY(p[k]):k==='relTo'?(f.members.find(x=>x.id===p.relTo)?pName(f.members.find(x=>x.id===p.relTo)):''):p[k]??''),file])}
  const xbytes=await xlsxBuild([['Parivar',[['Serial',...XCOLS,'Photo file'],...rows]],['Consent',[['Mukhiya',pName(mk)],['Mobile',mob],['Submission number',n],['Consent given at',new Date().toLocaleString('en-IN')],['Consent text',CONSENT]]]]);
  zip.file(`${mob}.xlsx`,xbytes);
  return{blob:await zip.generateAsync({type:'blob',compression:'DEFLATE'}),name:`${enName(mk.name)} ${mob}${n>1?'-'+n:''}.zip`,n}}
function sbText(){const mk=mkOf();return['DDH Parivar Vivran 2026','मुखिया: '+pName(mk),'साख: '+saakhLabel(mk.shakha,mk.gotra),'शहर/गाँव: '+(mk.city||''),'जिला: '+(mk.district||''),'राज्य: '+stateLabel(normState(mk.state)),'मोबाइल: '+mobOf(mk),'व्यवसाय: '+profText(mk)].join('\n')}
let sbBuild=null;
const sbStart=()=>{if(!sbBuild){sbBuild=buildZip();sbBuild.catch(()=>{})}return sbBuild};
function sbClose(){$('#sb-modal')?.remove();sbBuild=null}
function sbStep(s){
  const b=$('#sb-body');
  if(s==='consent')b.innerHTML=`<h3 style="margin:0 0 12px">Share</h3>${fam().submitted?'<p style="margin:0 0 10px">यह दोबारा भेजना (Resubmission) है।</p>':''}<label style="display:flex;gap:10px;align-items:flex-start;line-height:1.5"><input type="checkbox" id="sbChk" style="margin-top:5px;flex:none"><span>${CONSENT}</span></label><div class="bar" style="margin-top:16px"><button class="p wa" id="sbGo" disabled>${WA_ICON}Share</button><button id="sbBack">Back</button></div>`;
  else if(s==='steps')b.innerHTML=`<h3 style="margin:0 0 12px">WhatsApp पर भेजें</h3><p style="margin:0 0 8px">ZIP फाइल डाउनलोड हो गई है। WhatsApp में <b>9413843202</b> की चैट खोलकर 📎 → Document से यह ZIP फाइल भेजें।</p><div class="bar"><button id="sbCopy">नंबर कॉपी करें</button><a href="https://wa.me/${WA_NO}?text=${encodeURIComponent(sbText())}" target="_blank" rel="noopener">WhatsApp खोलें</a></div><div class="bar" style="margin-top:12px"><button class="p" id="sbNext">फाइल भेज दी</button><button id="sbBack">Back</button></div>`;
  else b.innerHTML=`<h3 style="margin:0 0 12px">क्या आपने फाइल WhatsApp पर भेज दी?</h3><div class="bar"><button class="p" id="sbSent">हाँ, भेज दी</button><button id="sbNo">नहीं</button></div>`}
function sbOpen(){
  const d=document.createElement('div');d.className='sk-ov open';d.id='sb-modal';d.style.cssText='align-items:center;padding:16px';
  d.innerHTML='<div class="sk-sheet" role="dialog" aria-modal="true" style="border-radius:24px;max-width:400px;padding:24px 20px" id="sb-body"></div>';document.body.appendChild(d);sbStep('consent');loadLibs().catch(()=>{})}
async function sbShare(){
  const btn=$('#sbGo');btn.disabled=true;
  let r;try{r=await sbStart()}catch(e){alert('ZIP फाइल नहीं बन सकी। कृपया इंटरनेट चालू करके दोबारा प्रयास करें।');sbBuild=null;btn.disabled=false;return}
  const file=new File([r.blob],r.name,{type:'application/zip'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],text:sbText()});sbStep('confirm');return}
    catch(e){if(e.name==='AbortError'){btn.disabled=false;return}}}
  const a=document.createElement('a');a.href=URL.createObjectURL(r.blob);a.download=r.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
  window.open(`https://wa.me/${WA_NO}?text=${encodeURIComponent(sbText())}`,'_blank','noopener,noreferrer');sbStep('steps')}
document.addEventListener('change',e=>{if(e.target.id==='sbChk'){$('#sbGo').disabled=!e.target.checked;if(e.target.checked)sbStart()}});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='subBtn')sbOpen();
  else if(t.id==='sbBack')sbClose();
  else if(t.id==='sbGo')sbShare();
  else if(t.id==='sbNext')sbStep('confirm');
  else if(t.id==='sbNo')sbStep('consent');
  else if(t.id==='sbCopy'){navigator.clipboard?.writeText('9413843202').then(()=>{t.textContent='कॉपी हो गया ✓'}).catch(()=>{})}
  else if(t.id==='sbSent'){sbStart().then(r=>{fam().submitted={n:r.n,at:new Date().toISOString()};Store.save(db);sbClose();flash='जानकारी भेजने की स्थिति सुरक्षित हो गई।';render()})}});

/* ===== Instructions pop-up: opens by itself 3 s after the user first scrolls the mukhiya form; only the OK button closes it ===== */
const INSTR_KEY='dadhich_instructions_seen';
const INSTR=['परिवार के मुखिया से संबंधित जानकारी भरकर Save Details बटन पर क्लिक करें।',
  'एक-एक कर परिवार के बाकी सदस्यों की जानकारी भरें।',
  'किसी सदस्य से जुड़ी जानकारी में संशोधन करने के लिए सूची में एडिट बटन पर क्लिक करें और नई जानकारी Save करें।',
  'आपके परिवार के सभी सदस्यों की जानकारी सही से भर जाने पर अध्यक्ष श्रीमान रमेश चंद्र दाधीच को WhatsApp के माध्यम से शेयर करें।',
  'Share बटन पर क्लिक करने पर सहमति चेकबॉक्स को क्लिक करें और फिर से Share बटन पर क्लिक करें। इससे आपके द्वारा भरी गई जानकारी और फोटो की एक ZIP फाइल बनकर WhatsApp खुल जाएगा और उसे श्रीमान रमेश चंद्र दाधीच को भेज दें।'];
const instrSeen=()=>{try{return localStorage.getItem(INSTR_KEY)==='1'}catch(e){return false}};
let instrTimer=0,instrScroll=null;
function instrOpen(){
  if($('#in-modal'))return;
  const d=document.createElement('div');d.className='sk-ov open';d.id='in-modal';d.style.cssText='align-items:center;padding:16px';
  d.innerHTML=`<div class="sk-sheet" role="alertdialog" aria-modal="true" aria-labelledby="in-t" style="border-radius:24px;max-width:420px;padding:24px 20px">
  <div class="sk-title" id="in-t" style="text-align:center">जानकारी भरने बाबत निर्देश</div>
  <ol class="ins">${INSTR.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>
  <button type="button" class="sk-ok" id="in-ok" style="display:block;width:65%;margin:20px auto 0">ठीक है</button></div>`;
  d.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('#in-ok').focus()}});   // keep focus inside; no backdrop-click / Escape close: OK is the only way out
  document.body.appendChild(d);$('#in-ok').focus();
}
function instrClose(){$('#in-modal')?.remove();try{localStorage.setItem(INSTR_KEY,'1')}catch(e){}}   // "seen" is recorded only when OK is pressed
function instrSchedule(){
  clearTimeout(instrTimer);
  if(instrScroll){window.removeEventListener('scroll',instrScroll);instrScroll=null}
  const due=()=>view==='mukhiya'&&!editId&&!instrSeen();   // first-time fill of the mukhiya form only
  if(!due())return;
  const go=()=>{
    if(!due()||$('#in-modal'))return;
    if($('#nt-modal.open')){instrTimer=setTimeout(go,500);return}   // wait until the notice pop-up has been closed
    instrOpen();
  };
  // Arm on the user's FIRST real scroll of the form; the pop-up opens 3 s after that scroll.
  instrScroll=()=>{
    if(window.scrollY<=0)return;   // ignore the programmatic scrollTo(0,0) done by render()
    window.removeEventListener('scroll',instrScroll);instrScroll=null;
    instrTimer=setTimeout(go,3000);
  };
  window.addEventListener('scroll',instrScroll,{passive:true});
}

/* ===== Render & events ===== */
function render(){
  const a=$('#app');
  $('#helpLine').hidden=view!=='mukhiya';   // contact line is shown only on the mukhiya's form
  if(view==='dash')a.innerHTML=dash();
  else{
    const role=view==='mukhiya'?'mukhiya':'member';
    const p=editId?{...fam().members.find(x=>x.id===editId)}:role==='mukhiya'?{state:'Rajasthan'}:{};   // new mukhiya form starts with Rajasthan pre-selected (visible, can be changed)
    a.innerHTML=(role==='member'&&!editId?'<div class="note">नया सदस्य मुखिया के परिवार में जोड़ा जाएगा।</div>':'')+personForm(p,role);
    const f=$('#pf');if(f.elements.state)locChange(f,'init',p);syncForm(f);photoInit(f);
    if(f.elements.sameAddr)sameAddrSync(f);
    if(f.elements.relTo)saakhLock(f);
    ['dob','marriage'].forEach(n=>f.elements[n]?.addEventListener('input',e=>{const t=e.target,x=t.value.replace(/\D/g,'').slice(0,8);t.value=x.length>4?`${x.slice(0,2)}/${x.slice(2,4)}/${x.slice(4)}`:x.length>2?`${x.slice(0,2)}/${x.slice(2)}`:x}));
    f.querySelector('#saakhBtn')?.addEventListener('click',()=>skOpen(f));
    f.addEventListener('change',e=>{if(e.target.name==='relation'){const g=RELF.has(e.target.value)?'महिला':RELM.has(e.target.value)?'पुरुष':'';const rb=g&&f.querySelector(`[name=gender][value="${g}"]`);if(rb)rb.checked=true}if(e.target.name==='relTo'||e.target.name==='relation'){autoParents(f);saakhLock(f)}if(e.target.name==='sameAddr')sameAddrSync(f);if(['state','district','shakha'].includes(e.target.name))locChange(f,e.target.name);syncForm(f)});
    f.addEventListener('input',e=>{const k=e.target.dataset?.np;if(k)f.elements[k].value=joinName(f.elements[k+'_f'].value,f.elements[k+'_l'].value)});
    f.addEventListener('submit',e=>{e.preventDefault();submitPerson(f,role)});
    $('#cancel')?.addEventListener('click',()=>{editId=null;view='dash';render()});
  }
  instrSchedule();
  window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.id==='instrBtn')instrOpen();
  else if(t.id==='in-ok')instrClose();
  else if(t.id==='addM'){editId=null;view='member';render()}
  else if(t.dataset.ed){const p=fam().members.find(x=>x.id===t.dataset.ed);editId=p.id;view=p.role==='mukhiya'?'mukhiya':'member';render()}
  else if(t.dataset.del){
    const p=fam().members.find(x=>x.id===t.dataset.del);
    if(p.role==='mukhiya'&&fam().members.length>1){alert('मुखिया को हटाने से पहले कृपया परिवार के अन्य सभी सदस्यों को हटाएँ।');return}
    const linked=fam().members.filter(x=>x.relTo===p.id).length;
    if(!confirm(`क्या आप "${pName(p)}" को हटाना चाहते हैं? यह कार्य वापस नहीं हो सकता।`+(linked?`\n\nध्यान दें: इनसे जुड़े ${linked} सदस्य(ों) का संबंध खाली हो जाएगा, उसे दोबारा चुनना होगा।`:'')))return;
    const bak=JSON.stringify(db);
    if(p.role==='mukhiya')db.families=[];
    else{fam().members=fam().members.filter(x=>x.id!==p.id);fam().members.forEach(x=>{if(x.relTo===p.id){x.relTo='';x.relation='';x.relOther=''}})}
    if(!Store.save(db)){db=JSON.parse(bak);return}   // not saved: undo the delete
    if(p.role==='mukhiya'){view='mukhiya';flash=''}else{flash='सदस्य हटा दिया गया।';editId=null;view='dash'}
    render();
  }
});
render();

/* ===== Notice pop-up: shown every time the page is opened or refreshed ===== */
(function(){
  const d=document.createElement('div');d.className='sk-ov open';d.id='nt-modal';d.style.alignItems='center';d.style.padding='16px';
  d.innerHTML=`<div class="sk-sheet" role="alertdialog" aria-modal="true" aria-labelledby="nt-t" aria-describedby="nt-d" style="border-radius:24px;max-width:400px;padding:24px 20px">
  <div class="sk-title" id="nt-t" style="text-align:center;text-decoration:underline">सूचना</div>
  <p id="nt-d" style="margin:8px 0 0;text-align:center">श्री दाधीच समाज (रजि.) संस्था, ब्यावर (राज.) के सदस्य परिवारों की यह जानकारी सामुदायिक उद्देश्य हेतु एकत्र की जा रही है। अधिक जानकारी के लिए अध्यक्ष श्रीमान रमेश चंद्र दाधीच से मोबाइल नंबर <a href="tel:+919413843202" style="color:var(--mr);font-weight:600">9413843202</a> पर संपर्क करें।</p>
  <button type="button" class="sk-ok" id="nt-ok" style="display:block;width:65%;margin:20px auto 0">ठीक है</button></div>`;
  document.body.appendChild(d);
  const close=()=>{d.classList.remove('open');document.removeEventListener('keydown',esc)},esc=e=>{if(e.key==='Escape')close()};
  d.addEventListener('click',e=>{if(e.target===d||e.target.id==='nt-ok')close()});
  document.addEventListener('keydown',esc);
  $('#nt-ok').focus();
})();
