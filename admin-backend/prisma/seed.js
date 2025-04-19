const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Создаем файлы для компании
        const companyMainPhoto = await prisma.file.create({
            data: {
                name: 'main_photo.webp',
                url: '/seed-files/company/main_photo.webp'
            }
        });

        const companyPhotos = await Promise.all([
            prisma.file.create({
                data: {
                    name: 'photo1.webp',
                    url: '/seed-files/company/photo1.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo2.webp',
                    url: '/seed-files/company/photo2.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo3.webp',
                    url: '/seed-files/company/photo3.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo4.webp',
                    url: '/seed-files/company/photo4.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo5.webp',
                    url: '/seed-files/company/photo5.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo6.webp',
                    url: '/seed-files/company/photo6.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo7.webp',
                    url: '/seed-files/company/photo7.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'photo8.webp',
                    url: '/seed-files/company/photo8.webp'
                }
            })
        ]);

        const companyCertificates = await Promise.all([
            prisma.file.create({
                data: {
                    name: 'certificate1.webp',
                    url: '/seed-files/company/sertificate1.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'certificate2.webp',
                    url: '/seed-files/company/sertificate2.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'certificate3.webp',
                    url: '/seed-files/company/sertificate3.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'certificate4.webp',
                    url: '/seed-files/company/sertificate4.webp'
                }
            })
        ]);

        // Создаем компанию
        const company = await prisma.company.create({
            data: {
                name: 'Dental',
                fullName: 'ООО «Дентал»',
                services: JSON.stringify([{ "name": "Терапевтическая стоматология", "description": "Специализируемся на лечении кариеса и его осложнений, а также восстановлении частично разрушенных зубов." }, { "name": "Ортопедия", "description": "Услуги включают установку съемных и несъемных ортопедических конструкций, восстановление разрушенных и отсутствующих зубов, а также устранение эстетических дефектов с использованием виниров, вкладок и коронок. Мы также предоставляем сложное протезирование при заболеваниях пародонта." }, { "name": "Пародонтология", "description": "Предоставляем профессиональную гигиену полости рта, а также проводим терапевтическое и хирургическое лечение тканей, окружающих зубы." }, { "name": "Хирургическая стоматология", "description": "Услуги включают в себя удаление разрушенных зубов, корней 'зубов мудрости' и новообразований в полости рта, а также зубосохраняющие операции." }, { "name": "Имплантация", "description": "Выполняем установку зубных имплантатов, восстанавливаем объем костной ткани при ее недостатке по ширине и высоте с использованием костной пластики и синус-лифтинга. Кроме того, мы применяем временные ортодонтические имплантаты для выравнивания положения зубов." }, { "name": "Ортодонтия", "description": "Исправляем прикус в любом возрасте и предоставляем индивидуальные ортодонтические конструкции, включая различные виды брекет-систем, каппы, трейнеры и многое другое." }]),
                slogan: 'Откройте улыбку с Dental',
                socialLinks: JSON.stringify({"whatsapp":"https://wa.me/79381303333","telegram":"https://t.me/Dental_vdonsk"}),
                legalAddress: '127254, г. Москва, Огородный проезд, 19 корп. 2',
                ogrnDetails: 'Свидетельство о внесении записи в Единый государственный реестр юридических лиц о юридическом лице, зарегистрированном до 01.07.2002, выдано 12.02.2003 Управлением МНС России по г. Москва, бланк серия 77 № 007376313',
                ogrn: '1037739596322 (свидетельство о внесении записи в Единый государственный реестр юридических лиц о юридическом лице, зарегистрированном до 01.07.2002, выдано 12.02.2003 Управлением МНС России по г. Москва, бланк серия 77 № 007376313).',
                inn: '6143099743',
                legalInn: '9715404657',
                email: 'dental-vdonsk@mail.ru',
                phone: '+7-938-130-3333',
                licence: '№ ЛО-61-01-008158 от 24 февраля 2022г.',
                address: 'г. Волгодонск, ул. Строителей 2е',
                schedule: "Пн-Пт с 9:00 до 19:00;Сб с 9:00 до 14:00",
                description: 'Мы - профессиональный медицинский центр, специализирующийся на современных методах лечения зубов и имплантации. Наша миссия - сделать процесс ухода за вашей улыбкой более доступным и приятным, предлагая широкий спектр услуг, начиная от регулярных осмотров и профилактики до сложных хирургических вмешательств и эстетической коррекции. Приходите к нам, и давайте вместе создадим здоровую, красивую и уверенную улыбку, которой вы будете гордиться',
                fullDescription: JSON.stringify(["Dental – это высококлассная стоматологическая клиника, применяющая передовые технологии и материалы от мировых брендов. Мы предоставляем консультации в разнообразных стоматологических направлениях, включая даже самые редкие случаи, что позволяет решать большинство проблем за одно посещение","Мы также уделяем большое внимание обучению наших врачей. У нас есть программа профессионального развития, предоставляющая врачам доступ к передовым методам и технологиям. Они также имеют возможность учиться у ведущих экспертов в своей области и проходить стажировки, в том числе за рубежом. Это гарантирует, что наши пациенты получают медицинское обслуживание на самом высшем уровне","Мы гордимся возможностью служить нашим пациентам и стремимся к совершенству в каждом аспекте нашей работы, осуществляем постоянный контроль качества и следим за тем, чтобы каждый пациент получил не только эффективное лечение, но и заботу и внимание, которые заслуживает"]),
                mainPhotoId: companyMainPhoto.id,
                photos: {
                    connect: companyPhotos.map(photo => ({ id: photo.id }))
                },
                certificates: {
                    connect: companyCertificates.map(cert => ({ id: cert.id }))
                }
            }
        });

        // Создаем файлы для первого доктора
        const doctor1Avatar = await prisma.file.create({
            data: {
                name: 'doctor1_avatar.webp',
                url: '/seed-files/doctors/doctor1/avatar.webp'
            }
        });

        // const doctor1Photos = await Promise.all([
        //     prisma.file.create({
        //         data: {
        //             name: 'doctor1_photo1.webp',
        //             url: 'seed-files/doctors/doctor1/photo1.webp'
        //         }
        //     }),
        //     prisma.file.create({
        //         data: {
        //             name: 'doctor1_photo2.webp',
        //             url: 'seed-files/doctors/doctor1/photo2.webp'
        //         }
        //     })
        // ]);

        const doctor1Certificates = await Promise.all([
            prisma.file.create({
                data: {
                    name: 'doctor1_cert1.webp',
                    url: '/seed-files/doctors/doctor1/certificate1.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'doctor1_cert2.webp',
                    url: '/seed-files/doctors/doctor1/sertificate2.webp'
                }
            })
        ]);

        // Создаем файлы для второго доктора
        const doctor2Avatar = await prisma.file.create({
            data: {
                name: 'doctor2_avatar.webp',
                url: '/seed-files/doctors/doctor2/avatar.webp'
            }
        });

        // const doctor2Photos = await Promise.all([
        //     prisma.file.create({
        //         data: {
        //             name: 'doctor2_photo1.webp',
        //             url: 'seed-files/doctors/doctor2/photo1.webp'
        //         }
        //     }),
        //     prisma.file.create({
        //         data: {
        //             name: 'doctor2_photo2.webp',
        //             url: 'seed-files/doctors/doctor2/photo2.webp'
        //         }
        //     })
        // ]);

        const doctor2Certificates = await Promise.all([
            prisma.file.create({
                data: {
                    name: 'doctor2_cert1.webp',
                    url: '/seed-files/doctors/doctor2/sertificate1.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'doctor2_cert2.webp',
                    url: '/seed-files/doctors/doctor2/sertificate2.webp'
                }
            })
        ]);

        // Создаем файлы для третьего доктора
        const doctor3Avatar = await prisma.file.create({
            data: {
                name: 'doctor3_avatar.webp',
                url: '/seed-files/doctors/doctor3/avatar.webp'
            }
        });

        // const doctor3Photos = await Promise.all([
        //     prisma.file.create({
        //         data: {
        //             name: 'doctor3_photo1.webp',
        //             url: 'seed-files/doctors/doctor3/photo1.webp'
        //         }
        //     }),
        //     prisma.file.create({
        //         data: {
        //             name: 'doctor3_photo2.webp',
        //             url: 'seed-files/doctors/doctor3/photo2.webp'
        //         }
        //     })
        // ]);

        const doctor3Certificates = await Promise.all([
            prisma.file.create({
                data: {
                    name: 'doctor3_cert1.webp',
                    url: '/seed-files/doctors/doctor3/sertificate1.webp'
                }
            }),
            prisma.file.create({
                data: {
                    name: 'doctor3_cert2.webp',
                    url: '/seed-files/doctors/doctor3/sertificate2.webp'
                }
            })
        ]);

        // Создаем врачей
        const doctors = await Promise.all([
            prisma.doctor.create({
                data: {
                    name: 'Иванов Иван Иванович',
                    education: 'Высшее образование',
                    educationPlaces: JSON.stringify(["В 2015-м году закончил Казанский Государственный Медицинский Университет","В 2016-м прошел интернатуру в городе Казань по специальности «Стоматолог общей практики»","В 2016-м получил Диплом о профессиональной переподготовке в «ЧГУ им. И.Н. Ульянова» по специальности «Стоматология ортопедическая»"]),
                    courses: JSON.stringify(["2017 — Практический курс: «Протезирование на имплантатах»","2017 — Препарирование передней и боковой группы зубов под металлокерамические и безметалловые конструкции","2018 — Реставрация зубов керамическими вкладками и винирами"]),
                    specialty: 'Стоматолог-терапевт',
                    experience: 15,
                    avatarId: doctor1Avatar.id,
                    // photos: {
                    //     connect: doctor1Photos.map(photo => ({ id: photo.id }))
                    // },
                    certificates: {
                        connect: doctor1Certificates.map(cert => ({ id: cert.id }))
                    },
                    categories: {
                        connect: [
                            { id: 1 }, // Терапевтическая стоматология
                            { id: 2 }  // Эстетическая стоматология
                        ]
                    }
                }
            }),
            prisma.doctor.create({
                data: {
                    name: 'Петров Василий Анатольевич',
                    education: 'Высшее образование',
                    educationPlaces: JSON.stringify(["В 2015-м году закончил Казанский Государственный Медицинский Университет","В 2016-м прошел интернатуру в городе Казань по специальности «Стоматолог общей практики»","В 2016-м получил Диплом о профессиональной переподготовке в «ЧГУ им. И.Н. Ульянова» по специальности «Стоматология ортопедическая»"]),
                    courses: JSON.stringify(["2017 — Практический курс: «Протезирование на имплантатах»","2017 — Препарирование передней и боковой группы зубов под металлокерамические и безметалловые конструкции","2018 — Реставрация зубов керамическими вкладками и винирами"]),
                    specialty: 'Стоматолог-ортопед',
                    experience: 10,
                    avatarId: doctor2Avatar.id,
                    // photos: {
                    //     connect: doctor2Photos.map(photo => ({ id: photo.id }))
                    // },
                    certificates: {
                        connect: doctor2Certificates.map(cert => ({ id: cert.id }))
                    },
                    categories: {
                        connect: [
                            { id: 3 }, // Ортопедическая стоматология
                            { id: 4 }  // Имплантология
                        ]
                    }
                }
            }),
            prisma.doctor.create({
                data: {
                    name: 'Сидоров Алексей Петрович',
                    education: 'Высшее образование',
                    educationPlaces: JSON.stringify(["В 2015-м году закончил Казанский Государственный Медицинский Университет","В 2016-м прошел интернатуру в городе Казань по специальности «Стоматолог общей практики»","В 2016-м получил Диплом о профессиональной переподготовке в «ЧГУ им. И.Н. Ульянова» по специальности «Стоматология ортопедическая»"]),
                    courses: JSON.stringify(["2017 — Практический курс: «Протезирование на имплантатах»","2017 — Препарирование передней и боковой группы зубов под металлокерамические и безметалловые конструкции","2018 — Реставрация зубов керамическими вкладками и винирами"]),
                    specialty: 'Стоматолог-хирург',
                    experience: 12,
                    avatarId: doctor3Avatar.id,
                    // photos: {
                    //     connect: doctor3Photos.map(photo => ({ id: photo.id }))
                    // },
                    certificates: {
                        connect: doctor3Certificates.map(cert => ({ id: cert.id }))
                    },
                    categories: {
                        connect: [
                            { id: 5 }, // Хирургическая стоматология
                            { id: 4 }  // Имплантология
                        ]
                    }
                }
            })
        ]);

        // Создаем администраторов
        const admins = await Promise.all([
            prisma.user.create({
                data: {
                    username: 'admin',
                    password: '$2a$10$zh7CMfhLqiQ2Q/kdmUaFXunbyBuR7rg8KFHUZnInQZE2sYC7Kz79y',
                    isAdmin: true
                }
            }),
            prisma.user.create({
                data: {
                    username: 'test',
                    password: '$2a$10$zh7CMfhLqiQ2Q/kdmUaFXunbyBuR7rg8KFHUZnInQZE2sYC7Kz79y',
                    isAdmin: true
                }
            })
        ]);

        console.log('Seed completed successfully!');
        console.log('Created company');
        console.log('Created doctors:');
        console.log('Created admins:');

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }); 