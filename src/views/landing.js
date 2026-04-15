// =========================================================
// LANDING PAGE VIEW
// =========================================================

export function renderLanding() {
  return `
  <!-- NAVBAR -->
  <header class="landing-header" id="main-header">
    <div class="container landing-nav">
      <a href="#" class="nav-brand">
        <img src="/Logo.jpeg" alt="Sanae Salud y Belleza" class="nav-logo">
        <div class="nav-brand-text">
          <span class="nav-brand-name">Sanae</span>
          <span class="nav-brand-tagline">Salud y Belleza</span>
        </div>
      </a>
      <nav class="nav-menu" id="nav-menu">
        <a href="#servicios" class="nav-link">Servicios</a>
        <a href="#como-funciona" class="nav-link">¿Cómo funciona?</a>
        <a href="#nosotros" class="nav-link">Nosotros</a>
        <a href="#contacto" class="nav-link">Contacto</a>
        <a href="#portal" data-route="login" class="btn btn-gold btn-sm">
          <i class="fas fa-calendar-check"></i> Reservar
        </a>
      </nav>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menú">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-bg-shapes">
      <div class="hero-shape hero-shape-1"></div>
      <div class="hero-shape hero-shape-2"></div>
      <div class="hero-shape hero-shape-3"></div>
    </div>
    <div class="container hero-container">
      <div class="hero-content" data-aos>
        <div class="badge badge-gold" style="font-size:var(--text-base); padding:8px 20px; margin-bottom:28px;">
          <i class="fas fa-star"></i> 15 Años de Experiencia
        </div>
        <h1 class="hero-title">
          Salud y Belleza<br><span class="text-gold">Hasta tu Hogar</span>
        </h1>
        <p class="hero-subtitle">
          Bienestar integral a domicilio. Sin traslados, sin esperas,<br class="hide-mobile"> con la comodidad y confianza que mereces.
        </p>
        <div class="hero-actions">
          <a href="#booking" data-route="login" class="btn btn-gold btn-xl">
            <i class="fas fa-calendar-plus"></i> Agendar Ahora
          </a>
          <a href="https://wa.me/56972715562?text=Hola,%20quisiera%20saber%20más%20sobre%20sus%20servicios"
             target="_blank" class="btn btn-whatsapp btn-xl">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><span class="stat-num">15+</span><span>Años</span></div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat"><span class="stat-num">100%</span><span>A domicilio</span></div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat"><span class="stat-num"><i class="fas fa-shield-alt"></i></span><span>Certificadas</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-img-wrapper">
          <img src="/Trat_coporales.jpeg" alt="Tratamientos corporales Sanae" class="hero-main-img">
        </div>
        <div class="hero-floating hero-float-1">
          <i class="fas fa-user-nurse"></i>
          <span>Profesionales certificadas</span>
        </div>
        <div class="hero-floating hero-float-2">
          <i class="fas fa-home"></i>
          <span>Atención a domicilio</span>
        </div>
        <div class="hero-badge-circle">
          <img src="/Logo.jpeg" alt="Sanae">
        </div>
      </div>
    </div>
    <div class="hero-scroll">
      <a href="#servicios"><i class="fas fa-chevron-down"></i></a>
    </div>
  </section>

  <!-- SERVICES -->
  <section id="servicios" class="section">
    <div class="container">
      <div class="section-header text-center">
        <span class="section-eyebrow">Lo que hacemos</span>
        <h2>Nuestras <span class="text-gold">Especialidades</span></h2>
        <p>Terapias y cuidados integrales de salud y estética, sin que tengas que salir de casa.</p>
        <div class="divider-accent"></div>
      </div>
      <div class="services-grid">
        ${servicesData.map((s, i) => `
        <div class="service-card" id="service-card-${i}">
          <div class="service-icon" style="background:${s.bg}">
            <i class="fas ${s.icon}" style="color:${s.color}"></i>
          </div>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <div class="service-card-actions">
            <button class="service-detail-btn" data-service-index="${i}">
              <i class="fas fa-info-circle"></i> Ver detalles
            </button>
            <a href="#booking" data-route="login" class="service-link">
              Reservar <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section id="como-funciona" class="section section-light">
    <div class="container">
      <div class="section-header text-center">
        <span class="section-eyebrow">Simple y Rápido</span>
        <h2>¿Cómo <span class="text-gold">Funciona?</span></h2>
        <p>Agenda tu sesión en minutos desde cualquier dispositivo.</p>
        <div class="divider-accent"></div>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">01</div>
          <div class="step-icon"><i class="fas fa-user-plus"></i></div>
          <h3>Regístrate</h3>
          <p>Crea tu cuenta gratuita en menos de 1 minuto. Solo necesitas tu nombre, email y teléfono.</p>
        </div>
        <div class="step-connector"><i class="fas fa-arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">02</div>
          <div class="step-icon"><i class="fas fa-calendar-alt"></i></div>
          <h3>Elige tu Servicio</h3>
          <p>Selecciona el tratamiento que necesitas, la fecha y el horario que más te acomode.</p>
        </div>
        <div class="step-connector"><i class="fas fa-arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">03</div>
          <div class="step-icon"><i class="fas fa-credit-card"></i></div>
          <h3>Paga Online</h3>
          <p>Pago seguro a través de Mercado Pago. Tarjetas de débito, crédito y transferencia.</p>
        </div>
        <div class="step-connector"><i class="fas fa-arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">04</div>
          <div class="step-icon"><i class="fas fa-home"></i></div>
          <h3>¡Listo! A tu Casa</h3>
          <p>Recibirás confirmación por WhatsApp. Nuestra profesional llegará puntual a tu domicilio.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="nosotros" class="section about-section">
    <div class="container about-container">
      <div class="about-visual">
        <div class="about-img-wrapper">
          <img src="/EnfermeraDomicilio.jpeg" alt="Enfermería a domicilio Sanae" class="about-img">
        </div>
        <div class="about-badge">
          <span class="about-badge-num">15+</span>
          <span class="about-badge-text">Años de<br>experiencia</span>
        </div>
      </div>
      <div class="about-content">
        <span class="section-eyebrow">Quiénes somos</span>
        <h2>Profesionalismo y <span class="text-gold">Confianza</span></h2>
        <div class="divider-accent" style="margin-bottom:24px;"></div>
        <p>En <strong>Sanae</strong> llevamos más de 15 años entregando atención personalizada de salud y estética directamente en tu hogar. Nuestro equipo de profesionales certificadas combina excelencia técnica con calidez humana.</p>
        <div class="about-values">
          <div class="about-value">
            <i class="fas fa-user-nurse"></i>
            <div>
              <strong>Cuidados de Enfermería</strong>
              <p>Profesionales de salud certificadas.</p>
            </div>
          </div>
          <div class="about-value">
            <i class="fas fa-leaf"></i>
            <div>
              <strong>Estética Integral</strong>
              <p>Tratamientos con aparatología de última generación.</p>
            </div>
          </div>
          <div class="about-value">
            <i class="fas fa-vial"></i>
            <div>
              <strong>Sueroterapia</strong>
              <p>Vitaminas y terapias endovenosas a domicilio.</p>
            </div>
          </div>
          <div class="about-value">
            <i class="fas fa-heart"></i>
            <div>
              <strong>Trato Personalizado</strong>
              <p>Protocolos adaptados a tus necesidades individuales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section id="contacto" class="section section-primary cta-section">
    <div class="container">
      <div class="cta-inner">
        <div class="cta-text">
          <h2>¿Lista para tu sesión de bienestar?</h2>
          <p>Agenda hoy mismo. Cupos limitados por semana.</p>
        </div>
        <div class="cta-actions">
          <a href="#booking" data-route="login" class="btn btn-gold btn-xl">
            <i class="fas fa-calendar-plus"></i> Reservar Ahora
          </a>
          <a href="https://wa.me/56972715562" target="_blank" class="btn btn-outline btn-xl">
            <i class="fab fa-whatsapp"></i> +56 9 7271 5562
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <div class="footer-logo-wrap">
          <img src="/Logo.jpeg" alt="Sanae Logo">
          <div>
            <div class="footer-brand-name">Sanae</div>
            <div class="footer-brand-sub">Salud y Belleza</div>
          </div>
        </div>
        <p>Llevamos bienestar, salud y belleza hasta tu hogar. 15 años de experiencia a tu servicio.</p>
        <div class="footer-social">
          <a href="https://wa.me/56972715562" target="_blank" class="social-icon wsp"><i class="fab fa-whatsapp"></i></a>
          <a href="#" class="social-icon ig"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-icon fb"><i class="fab fa-facebook-f"></i></a>
        </div>
      </div>
      <div class="footer-links-col">
        <h4>Servicios</h4>
        <a href="#servicios">Masajes</a>
        <a href="#servicios">Limpieza Facial</a>
        <a href="#servicios">Sueroterapia</a>
        <a href="#servicios">Drenaje Linfático</a>
        <a href="#servicios">Cuidados de Enfermería</a>
      </div>
      <div class="footer-links-col">
        <h4>Mi Cuenta</h4>
        <a href="#" data-route="login">Iniciar sesión</a>
        <a href="#" data-route="register">Registrarse</a>
        <a href="#" data-route="dashboard">Mi panel</a>
      </div>
      <div class="footer-contact-col">
        <h4>Contacto</h4>
        <a href="tel:+56972715562"><i class="fas fa-phone"></i> +56 9 7271 5562</a>
        <a href="https://wa.me/56972715562" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
        <a href="mailto:info@sanae.cl"><i class="fas fa-envelope"></i> info@sanae.cl</a>
        <p style="margin-top:12px; color:var(--blue-300);"><i class="fas fa-map-marker-alt"></i> Atención a domicilio — Santiago y alrededores</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Sanae - Salud y Belleza. Todos los derechos reservados.</p>
      <p>Desarrollado con <i class="fas fa-heart" style="color:var(--gold-500)"></i> por Santisoft</p>
    </div>
  </footer>
  `;
}

const servicesData = [
  {
    icon: 'fa-spa',
    title: 'Masajes',
    desc: 'Masajes relajantes, descontracturantes y deportivos adaptados a tus necesidades musculares y de bienestar.',
    bg: '#eef4ff', color: '#1a56db',
    duration: '60 – 90 min',
    modalTitle: 'Masajes Profesionales',
    fullDesc: 'Nuestros masajes terapéuticos son realizados por profesionales certificadas que combinan técnicas internacionales con un profundo conocimiento anatómico. Cada sesión se adapta completamente a tus necesidades, desde la presión hasta el tipo de aceite utilizado.',
    types: [
      { name: 'Masaje Relajante Sueco', desc: 'Técnica de deslizamiento suave y rítmico que libera la tensión acumulada y activa la circulación. Ideal para reducir el estrés, mejorar el sueño y restaurar el equilibrio emocional.' },
      { name: 'Masaje Descontracturante', desc: 'Trabaja sobre nudos musculares y contracturas crónicas mediante presión profunda y maniobras específicas. Ideal para personas con dolores cervicales, lumbares o tensión por trabajar frente al computador.' },
      { name: 'Masaje Deportivo', desc: 'Diseñado para deportistas que buscan prevenir lesiones, acelerar la recuperación muscular o preparar el cuerpo para la actividad física. Combina técnicas de compresión, percusión y estiramiento.' },
      { name: 'Masaje con Piedras Calientes', desc: 'Uso de basalto volcánico calentado que se desliza sobre los músculos, penetrando el calor en profundidad. Proporciona una relajación incomparable y alivia dolores articulares y musculares crónicos.' },
    ],
    benefits: ['Reduce el estrés y la ansiedad', 'Alivia contracturas y dolores musculares', 'Mejora la circulación sanguínea', 'Aumenta la flexibilidad articular', 'Favorece el sueño reparador', 'Estimula el sistema inmunológico'],
    includes: ['Camilla profesional portátil', 'Aceites esenciales de aromaterapia', 'Música relajante ambiental', 'Sabanas y toallas incluidas', 'Evaluación inicial sin costo'],
    note: 'Se recomienda hidratarse bien antes y después de la sesión. Disponible para personas desde 16 años. Contraindicado en fiebre, infecciones activas o lesiones agudas sin evaluación médica previa.'
  },
  {
    icon: 'fa-face-smile',
    title: 'Limpieza Facial y de Espalda',
    desc: 'Limpiezas faciales profundas y tratamientos de espalda utilizando aparatología moderna y productos premium.',
    bg: '#fdf6e3', color: '#C9A84C',
    duration: '60 – 90 min',
    modalTitle: 'Limpieza Facial y de Espalda Profesional',
    fullDesc: 'Nuestros tratamientos de limpieza facial y de espalda combinan protocolos estéticos avanzados con aparatología de última generación. Utilizamos productos clínicamente probados, libres de parabenos, adaptados a cada tipo de piel para obtener resultados visibles desde la primera sesión.',
    types: [
      { name: 'Limpieza Facial Profunda', desc: 'Protocolo completo de 8 pasos: limpieza doble, exfoliación enzimática, arrastre con vapor, extracción de comedones, alta frecuencia antibacteriana, tonificación, sérum activo y mascarilla calmante. Indicada para piel con exceso de grasa, puntos negros o acné leve-moderado.' },
      { name: 'Tratamiento Hidratante Intensivo', desc: 'Sesión orientada a pieles secas, deshidratadas o con signos de envejecimiento. Incluye ácido hialurónico al 2%, electroporación transdérmica y aplicación de mascarilla biocelulosa de colágeno marino.' },
      { name: 'Limpieza de Espalda', desc: 'Protocolo similar al facial adaptado a la zona de la espalda, una de las más propensas a acné y foliculitis por la dificultad de acceso. Incluye exfoliación mecánica, extracción y tratamiento con luz LED azul.' },
      { name: 'Peeling Químico Superficial', desc: 'Aplicación controlada de ácidos (glicólico, mandélico o salicílico) para renovar el estrato córneo, unificar el tono, reducir manchas y estimular la producción de colágeno. Proceso guiado por profesional certificada.' },
    ],
    benefits: ['Piel más limpia, luminosa y uniforme', 'Reducción de poros dilatados', 'Eliminación de puntos negros y espinillas', 'Control del exceso de sebo', 'Hidratación profunda duradera', 'Prevención del envejecimiento prematuro'],
    includes: ['Kit de productos adaptado a tu tipo de piel', 'Aparatología profesional (ultrasonido, alta frecuencia, luz LED)', 'Análisis de piel con lupa', 'Mascarilla desmineralizante incluida', 'Recomendaciones de cuidado post sesión'],
    note: 'Evitar exposición solar intensa las 48 hrs posteriores al tratamiento. Se recomienda no maquillarse las primeras 12 hrs. Para casos de rosácea clínica o piel hipersensible se realiza protocolo adaptado.'
  },
  {
    icon: 'fa-vial',
    title: 'Sueroterapia',
    desc: 'Terapias endovenosas y administración de vitaminas y sueros para potenciar tu salud desde adentro.',
    bg: '#f0fdf4', color: '#22c55e',
    duration: '45 – 60 min',
    modalTitle: 'Sueroterapia y Terapias Endovenosas',
    fullDesc: 'La sueroterapia es la administración intravenosa de sueros fisiológicos enriquecidos con vitaminas, minerales y antioxidantes, logrando una absorción del 100% en comparación al 20-30% de la vía oral. Nuestras enfermeras realizan el procedimiento con todos los protocolos de asepsia y control de signos vitales, en la comodidad de tu hogar.',
    types: [
      { name: 'Suero Vitamina C Megadosis', desc: 'Infusión de vitamina C (ácido ascórbico) en altas concentraciones para fortalecer el sistema inmunológico, actuar como potente antioxidante, mejorar la síntesis de colágeno y combatir el cansancio crónico.' },
      { name: 'Suero Energizante y Revitalizante', desc: 'Combinación de complejo B (B1, B6, B12), magnesio, zinc y glucosa. Ideal para recuperarse del agotamiento físico, jet lag, exceso de trabajo o después de enfermedades virales. Resultados visibles en horas.' },
      { name: 'Suero Hidratante y Detox', desc: 'Solución salina isotónica enriquecida con electrolitos y glutatión (el antioxidante maestro del cuerpo). Indicado para recuperación post-ejercicio intenso, guayabo, gastroenteritis o deshidratación severa.' },
      { name: 'Suero Anti-Aging (Antienvejecimiento)', desc: 'Coctel de coenzima Q10, ácido alfa-lipoico, resveratrol y vitaminas liposolubles que actúan sinérgicamente para combatir el estrés oxidativo, mejorar la elasticidad de la piel y potenciar la energía celular.' },
      { name: 'Administración de Medicamentos EV/IM', desc: 'Administración profesional de medicamentos prescritos por médico, tanto endovenosos como intramusculares, evitando traslados a centros de salud.' },
    ],
    benefits: ['Absorción del 100% de nutrientes', 'Resultados inmediatos (en 20-40 min)', 'Fortalecimiento del sistema inmune', 'Recuperación rápida del agotamiento', 'Mejora de la piel, cabello y uñas', 'Detoxificación celular profunda'],
    includes: ['Evaluación de salud previa', 'Material estéril de un solo uso', 'Control de signos vitales antes y después', 'Profesional enfermera certificada', 'Informe del procedimiento'],
    note: 'Requiere que el paciente haya comido al menos 2 horas antes. No se realiza en embarazadas sin indicación médica. Siempre se verifica alergias y medicamentos actuales antes de proceder.'
  },
  {
    icon: 'fa-leaf',
    title: 'Drenaje Linfático',
    desc: 'Masajes linfáticos expertos y cuidados post operatorios para tu recuperación y bienestar circulatorio.',
    bg: '#fdf0ff', color: '#a855f7',
    duration: '60 – 90 min',
    modalTitle: 'Drenaje Linfático Manual (DLM)',
    fullDesc: 'El Drenaje Linfático Manual (DLM) es una técnica especializada de masaje suave que activa el sistema linfático, principal vía de eliminación de toxinas y líquidos en exceso del cuerpo. Nuestras profesionales están certificadas en la técnica de Vodder y Leduc, las más reconocidas internacionalmente.',
    types: [
      { name: 'Drenaje Linfático Estético', desc: 'Orientado a la reducción de edemas, celulitis y retención de líquidos. Con presiones rítmicas y suaves sobre las vías linfáticas, se estimula la evacuación del líquido intersticial hacia los ganglios. Indicado para quienes tienen piernas pesadas, hinchadas o retención de líquidos crónica.' },
      { name: 'Drenaje Post Operatorio', desc: 'Protocolo específico para cirugías estéticas (lipoescultura, abdominoplastia, rinoplastia, mamoplastia) o reconstructivas. Reduce la inflamación, previene la fibrosis y las adherencias, desinflamatoria y acelera la recuperación. Se recomienda iniciar desde las 48-72 hrs post cirugía.' },
      { name: 'Drenaje Linfático Oncológico', desc: 'Técnica adaptada para pacientes con linfedema secundario a tratamientos oncológicos (cirugía, radioterapia). Alivia la acumulación de linfa en extremidades, mejora la movilidad y contribuye al bienestar general con una presión ultrafina y controlada.' },
      { name: 'Drenaje Facial', desc: 'Técnica de presiones suaves sobre los ganglios linfáticos del cuello y rostro para eliminar bolsas, ojeras, hinchazón matutina y preparar la piel para tratamientos estéticos. Muy solicitado antes de eventos importantes.' },
    ],
    benefits: ['Reducción de edemas e inflamación', 'Aceleración de la recuperación post-op', 'Eliminación de toxinas y líquidos', 'Prevención de fibrosis post cirugía', 'Mejora de la circulación venosa', 'Reducción de celulitis y retención de líquidos', 'Efecto relajante del sistema nervioso'],
    includes: ['Evaluación linfática inicial', 'Maniobras de la técnica Vodder certificada', 'Vendaje compresivo si corresponde', 'Indicaciones post sesión personalizadas', 'Protocolo de sesiones recomendado'],
    note: 'Contraindicado en trombosis venosa profunda activa, infecciones bacterianas agudas, insuficiencia cardíaca descompensada o tumores activos sin evaluación médica. Se informará en la evaluación previa si aplica tu caso.'
  },
  {
    icon: 'fa-user-nurse',
    title: 'Cuidados de Enfermería',
    desc: 'Administración de medicamentos, curaciones, control de signos vitales y cuidados domiciliarios de 6, 12 y 24 hrs.',
    bg: '#fff1f2', color: '#ef4444',
    duration: 'Por hora o turno (6, 12, 24 hrs)',
    modalTitle: 'Cuidados Profesionales de Enfermería a Domicilio',
    fullDesc: 'Contamos con un equipo de enfermeras tituladas y técnicos en enfermería con registro activo en la Superintendencia de Salud. Brindamos atención domiciliaria con todos los protocolos clínicos exigidos en centros de salud, pero en la comodidad de tu hogar. Disponibles las 24 horas, los 7 días de la semana.',
    types: [
      { name: 'Visitas de Enfermería (1-2 hrs)', desc: 'Ideal para controles puntuales: toma de signos vitales (presión arterial, saturación, temperatura, frecuencia cardíaca), aplicación de inyecciones, extracción de sangre, control de heridas y educación al paciente.' },
      { name: 'Curaciones Simples y Avanzadas', desc: 'Limpieza y manejo de heridas agudas o crónicas: úlceras por presión, pie diabético, heridas quirúrgicas, quemaduras. Utilizamos materiales de última generación (alginatos, hidrogeles, apósitos de plata) según protocolo clínico.' },
      { name: 'Manejo de Sondas y Catéteres', desc: 'Instalación, manejo y recambio de sonda Foley, nasogástrica y suprapúbica. Mantenimiento de catéteres venosos periféricos y centrales para pacientes con terapia endovenosa domiciliaria.' },
      { name: 'Retiro de Suturas y Puntos', desc: 'Procedimiento realizado con técnica aséptica rigurosa. Se evalúa la evolución de la herida y se informa al paciente o familia sobre los cuidados posteriores.' },
      { name: 'Turnos de Enfermería (6, 12 y 24 hrs)', desc: 'Para pacientes con dependencia moderada o severa, postrados, adultos mayores o recuperación post-cirugía. La enfermera o TENS permanece en el hogar durante el turno pactado, brindando todos los cuidados necesarios con registro de evolución.' },
      { name: 'Control de Presión Arterial y Perfil', desc: 'Control de PA en distintos momentos del día para evaluar hipertensión, efectividad de tratamiento o cambios posturales. Se entrega informe de resultados.' },
    ],
    benefits: ['Seguridad clínica en el hogar', 'Evita traslados y esperas en centros de salud', 'Personal registrado y supervisado', 'Registro escrito de cada atención', 'Comunicación directa con médico tratante si se requiere', 'Apoyo emocional al paciente y familia'],
    includes: ['Maletín clínico completo (esfigmomanómetro, oxímetro, termómetro, glucómetro)', 'Material de curaciones estéril', 'Registro de enfermería por escrito', 'Disponibilidad 24/7 para urgencias', 'Coordinación con médico tratante'],
    note: 'Para turnos de 12 y 24 hrs solicitamos la orden médica o indicaciones del médico tratante del paciente. En caso de urgencias médicas graves siempre se activa el sistema de emergencias (SAMU / 131).'
  },
  {
    icon: 'fa-shield-heart',
    title: 'Post Operatorio',
    desc: 'Protocolo integral de recuperación post cirugía: drenajes, cuidados de heridas y acompañamiento profesional.',
    bg: '#eff6ff', color: '#3b82f6',
    duration: '60 – 120 min por sesión',
    modalTitle: 'Protocolo Integral Post Operatorio',
    fullDesc: 'La recuperación post quirúrgica es una etapa crucial que determina en gran medida los resultados finales de cualquier intervención. Nuestro protocolo combina drenaje linfático certificado, cuidados de heridas quirúrgicas y acompañamiento profesional continuo para garantizar una recuperación segura, cómoda y en el menor tiempo posible.',
    types: [
      { name: 'Post Lipoescultura y Liposucción', desc: 'Protocolo intensivo de drenaje linfático desde las 48-72 hrs. Manejo de moldes, fajas y zonas de mayor edema. Se trabajan las zonas intervenidas con maniobras específicas para evitar fibrosis, irregularidades y retracciones de la piel.' },
      { name: 'Post Abdominoplastia', desc: 'Cuidados de la herida abdominal extensa, control de drenajes quirúrgicos si persisten, manejo del edema residual y vigilancia de signos de alarma (infección, seroma, necrosis). Ejercicios respiratorios y de movilización temprana.' },
      { name: 'Post Mamoplastia (Aumento / Reducción)', desc: 'Drenaje linfático específico del área mamaria y axilar. Cuidado de las incisiones, evaluación de la posición de implantes y guía para los ejercicios de movilización del hombro que evitan la retracción capsular.' },
      { name: 'Post Rinoplastia y Cirugías Faciales', desc: 'Drenaje linfático facial ultrafino, manejo del edema periorbitario, cuidado de apósitos y vigilancia de la evolución de la cicatriz. Incluye masaje cicatrizal cuando la herida lo permite.' },
      { name: 'Manejo de Cicatrices', desc: 'Tratamiento con presión sostenida, masaje transversal profundo y ultrasonido (si disponible) sobre cicatrices antiguas o nuevas para mejorar su aspecto, elasticidad y prevenir adherencias al tejido subyacente.' },
    ],
    benefits: ['Recuperación más rápida y segura', 'Reducción del dolor y la inflamación', 'Prevención de fibrosis y adherencias', 'Mejores resultados estéticos finales', 'Detección precoz de complicaciones', 'Acompañamiento y tranquilidad para el paciente', 'Registro detallado de evolución'],
    includes: ['Evaluación inicial foto-documentada', 'Protocolo personalizado según cirugía', 'Coordinación con cirujano tratante', 'Material estéril para curaciones', 'Guía de cuidados en casa entre sesiones', 'Número de contacto directo para consultas'],
    note: 'Siempre solicitamos el tipo de cirugía realizada, fecha de intervención e indicaciones del cirujano. No realizamos procedimientos que contraindique el médico tratante. Ante cualquier signo de complicación indicamos consulta médica de inmediato.'
  },
];

export function initLandingScripts() {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }

  // Sticky header
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Scroll animations
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Service detail modals
  document.querySelectorAll('.service-detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = servicesData[parseInt(btn.dataset.serviceIndex)];
      if (s) openServiceModal(s);
    });
  });
}

function openServiceModal(s) {
  // Remove any existing modal
  document.getElementById('service-modal')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'service-modal';
  overlay.className = 'svc-modal-overlay';
  overlay.innerHTML = `
    <div class="svc-modal" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="svc-modal-header" style="--svc-color:${s.color}; --svc-bg:${s.bg}">
        <div class="svc-modal-icon">
          <i class="fas ${s.icon}"></i>
        </div>
        <div class="svc-modal-header-text">
          <div class="svc-modal-eyebrow">Servicio Sanae</div>
          <h2 class="svc-modal-title">${s.modalTitle}</h2>
          <div class="svc-modal-duration">
            <i class="fas fa-clock"></i> Duración: <strong>${s.duration}</strong>
          </div>
        </div>
        <button class="svc-modal-close" id="svc-close-btn" aria-label="Cerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="svc-modal-body">
        <!-- Descripción -->
        <p class="svc-modal-desc">${s.fullDesc}</p>

        <!-- Tipos / Modalidades -->
        <div class="svc-modal-section">
          <h3 class="svc-section-title">
            <i class="fas fa-list-check" style="color:${s.color}"></i> Modalidades disponibles
          </h3>
          <div class="svc-types-list">
            ${s.types.map((t, i) => `
            <details class="svc-type-item" ${i === 0 ? 'open' : ''}>
              <summary class="svc-type-summary">
                <span class="svc-type-dot" style="background:${s.color}"></span>
                ${t.name}
                <i class="fas fa-chevron-down svc-type-chevron"></i>
              </summary>
              <p class="svc-type-desc">${t.desc}</p>
            </details>`).join('')}
          </div>
        </div>

        <div class="svc-modal-cols">
          <!-- Beneficios -->
          <div class="svc-modal-section">
            <h3 class="svc-section-title">
              <i class="fas fa-heart" style="color:${s.color}"></i> Beneficios
            </h3>
            <ul class="svc-benefits">
              ${s.benefits.map(b => `<li><i class="fas fa-check" style="color:${s.color}"></i>${b}</li>`).join('')}
            </ul>
          </div>

          <!-- Incluye -->
          <div class="svc-modal-section">
            <h3 class="svc-section-title">
              <i class="fas fa-box-open" style="color:${s.color}"></i> Incluye
            </h3>
            <ul class="svc-benefits">
              ${s.includes.map(inc => `<li><i class="fas fa-star" style="color:var(--gold-500)"></i>${inc}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Nota importante -->
        <div class="svc-modal-note">
          <i class="fas fa-info-circle"></i>
          <p>${s.note}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="svc-modal-footer">
        <button class="btn btn-outline-blue" id="svc-close-btn-2">
          Cerrar
        </button>
        <a href="https://wa.me/56972715562?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20${encodeURIComponent(s.modalTitle)}" target="_blank" class="btn btn-whatsapp" style="animation:none;">
          <i class="fab fa-whatsapp"></i> Consultar por WhatsApp
        </a>
        <a href="#booking" data-route="login" class="btn btn-gold">
          <i class="fas fa-calendar-plus"></i> Reservar ahora
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    overlay.classList.add('closing');
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 250);
  };

  document.getElementById('svc-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('svc-close-btn-2')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', handler); }
  });

  // Re-bind data-route links inside modal
  overlay.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      closeModal();
      setTimeout(() => window.dispatchEvent(new CustomEvent('navigate', { detail: el.dataset.route })), 260);
    });
  });
}
