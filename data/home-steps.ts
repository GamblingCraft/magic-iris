export type HomeStep = {
  id: string
  navLabel: string
  title: string
  description: string
  image: string
  navImage?: string
  color: string
}

export const homeSteps: HomeStep[] = [
  {
    id: 'step-interview',
    navLabel: 'интервью',
    title: 'Погружение в задачу события',
    description:
      'Уточняем формат мероприятия, площадку, количество гостей, тайминг и настроение вечера. На этом этапе собираем всю основу для будущего шоу или мастер-класса.',
    image:
      'images/interview.webp',
    navImage:
      'images/num/1.webp',
    color: '#d9ccbc'
  },
  {
    id: 'step-concept',
    navLabel: 'Концепция',
    title: 'Разработка сценария и визуальной идеи',
    description:
      'На основе брифа подбираем формат: песочное шоу, световой номер, шоу-портрет или творческую зону. Собираем сюжет, акценты и понимание, какой момент должен стать кульминацией.',
    image:
      'images/concept.webp',
    navImage:
      'images/num/2.webp',
    color: '#edeff3'
  },
  {
    id: 'step-presentation',
    navLabel: 'презентация',
    title: 'Презентация подачи и ключевых моментов',
    description:
      'Показываем, как будет выглядеть номер или вся программа: тайминг, музыка, визуальные акценты, желаемое настроение и точки вовлечения гостей.',
    image:
      'images/present.webp',
    navImage:
      'images/num/3.webp',
    color: '#aacce9'
  },
  {
    id: 'step-approval',
    navLabel: 'согласование',
    title: 'Подтверждение тайминга и сметы',
    description:
      'Фиксируем итоговый сценарий, логистику, время монтажа, работу с ведущим и точную стоимость. На этом этапе у вас есть полное понимание, как все будет происходить.',
    image:
      'images/approve.webp',
    navImage:
      'images/num/4.webp',
    color: '#edeef5'
  },
  {
    id: 'step-preparation',
    navLabel: 'подготовка',
    title: 'Команда, техника и материалы под задачу',
    description:
      'Готовим все, что нужно для площадки: оборудование, графику, реквизит, расходники, мастеров и выездную команду. Контролируем детали, чтобы в день события все сработало без спешки.',
    image:
      'images/prepare.webp',
    navImage:
      'images/num/5.webp',
    color: '#a8a1c8'
  },
  {
    id: 'step-event',
    navLabel: 'событие',
    title: 'Проведение шоу и работа на площадке',
    description:
      'Приезжаем заранее, монтируемся, проверяем свет, музыку и встраиваемся в общий тайминг. Вы наслаждаетесь моментом, а мы отвечаем за вау-эффект и четкую организацию.',
    image:
      'images/event.webp',
    navImage:
      'images/num/6.webp',
    color: '#e7e3ef'
  }
]
