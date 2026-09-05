/* =============================================
   MEDICORE HOSPITAL - React.js Interactive Components
   React 18 Production UMD Integration
   ============================================= */

(function () {
  'use strict';

  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM not loaded.');
    return;
  }

  const { useState, useEffect } = React;
  const e = React.createElement;

  // Mock Doctor Database for React widgets
  const DOCTORS_DATA = [
    { id: 1, name: 'Dr. James Carter', specialty: 'Cardiologist', dept: 'Cardiology', rating: '4.9', exp: '15+ yrs', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80', status: 'Available Today' },
    { id: 2, name: 'Dr. Sarah Mitchell', specialty: 'Neurologist', dept: 'Neurology', rating: '4.8', exp: '12+ yrs', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', status: 'Available Today' },
    { id: 3, name: 'Dr. Alan Rogers', specialty: 'Orthopedic Surgeon', dept: 'Orthopedics', rating: '5.0', exp: '18+ yrs', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80', status: 'In Consultation' },
    { id: 4, name: 'Dr. Lisa Chen', specialty: 'Pediatrician', dept: 'Pediatrics', rating: '4.9', exp: '10+ yrs', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80', status: 'Available Today' },
    { id: 5, name: 'Dr. Michael Vance', specialty: 'Ophthalmologist', dept: 'Ophthalmology', rating: '4.7', exp: '14+ yrs', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80', status: 'Available Tomorrow' },
    { id: 6, name: 'Dr. Emily Watson', specialty: 'Oncologist', dept: 'Oncology', rating: '5.0', exp: '20+ yrs', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80', status: 'Available Today' },
  ];

  // ============================================
  // 1. REACT APPOINTMENT BOOKING WIDGET
  // ============================================
  function AppointmentWidget() {
    const [step, setStep] = useState(1);
    const [dept, setDept] = useState('Cardiology');
    const [doctor, setDoctor] = useState('Dr. James Carter');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('10:00 AM');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [bookingRef, setBookingRef] = useState('');

    const availableDocs = DOCTORS_DATA.filter(d => d.dept === dept);

    useEffect(() => {
      if (availableDocs.length > 0) {
        setDoctor(availableDocs[0].name);
      } else {
        setDoctor('Any Available Specialist');
      }
    }, [dept]);

    const handleSubmit = (ev) => {
      ev.preventDefault();
      if (!name || !email || !phone) {
        alert('Please fill out all required fields.');
        return;
      }
      const randomRef = 'MC-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(randomRef);
      setStep(3);
    };

    if (step === 3) {
      return e('div', { className: 'card highlight-box text-center', style: { padding: '32px 24px', margin: '0 auto', maxWidth: '640px' } }, [
        e('div', { key: 'icon', style: { fontSize: '3.5rem', color: 'var(--success)', marginBottom: '16px' } }, e('i', { className: 'fas fa-check-circle' })),
        e('h3', { key: 'title', style: { fontSize: '1.6rem', marginBottom: '8px' } }, 'Appointment Confirmed!'),
        e('p', { key: 'sub', style: { fontSize: '0.95rem', marginBottom: '20px' } }, 'Your appointment request has been successfully recorded.'),
        e('div', { key: 'details', style: { background: 'var(--bg-light)', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px' } }, [
          e('p', { key: 'ref', style: { margin: '4px 0', fontWeight: '700', color: 'var(--primary)' } }, `Confirmation Code: ${bookingRef}`),
          e('p', { key: 'pname', style: { margin: '4px 0' } }, `Patient: ${name}`),
          e('p', { key: 'pdept', style: { margin: '4px 0' } }, `Department: ${dept}`),
          e('p', { key: 'pdoc', style: { margin: '4px 0' } }, `Doctor: ${doctor}`),
          e('p', { key: 'ptime', style: { margin: '4px 0' } }, `Slot: ${date || 'Tomorrow'} at ${timeSlot}`),
        ]),
        e('button', {
          key: 'reset',
          className: 'btn btn-primary',
          onClick: () => { setStep(1); setName(''); setEmail(''); setPhone(''); }
        }, e('i', { className: 'fas fa-calendar-plus' }), ' Book Another Appointment')
      ]);
    }

    return e('div', { className: 'card appointment-react-card', style: { background: 'var(--bg-white)', padding: '30px', borderRadius: '16px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)' } }, [
      e('div', { key: 'header', style: { marginBottom: '24px' } }, [
        e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' } }, [
          e('span', { className: 'tag' }, e('i', { className: 'fab fa-react' }), ' Powered by React.js'),
          e('span', { style: { fontSize: '0.85rem', color: 'var(--text-muted)' } }, `Step ${step} of 2`)
        ]),
        e('h3', { style: { marginTop: '12px', fontSize: '1.4rem' } }, step === 1 ? '1. Select Department & Doctor' : '2. Patient Contact Information')
      ]),

      step === 1 ? e('div', { key: 'step1' }, [
        e('div', { className: 'form-group', style: { marginBottom: '16px' } }, [
          e('label', { className: 'form-label' }, 'Select Department'),
          e('select', {
            className: 'form-control',
            value: dept,
            onChange: (ev) => setDept(ev.target.value)
          }, [
            e('option', { key: 'c', value: 'Cardiology' }, 'Cardiology'),
            e('option', { key: 'n', value: 'Neurology' }, 'Neurology'),
            e('option', { key: 'o', value: 'Orthopedics' }, 'Orthopedics'),
            e('option', { key: 'p', value: 'Pediatrics' }, 'Pediatrics'),
            e('option', { key: 'op', value: 'Ophthalmology' }, 'Ophthalmology'),
            e('option', { key: 'on', value: 'Oncology' }, 'Oncology')
          ])
        ]),
        e('div', { className: 'form-group', style: { marginBottom: '16px' } }, [
          e('label', { className: 'form-label' }, 'Preferred Doctor'),
          e('select', {
            className: 'form-control',
            value: doctor,
            onChange: (ev) => setDoctor(ev.target.value)
          }, availableDocs.map(d => e('option', { key: d.id, value: d.name }, `${d.name} (${d.specialty})`)))
        ]),
        e('div', { className: 'form-row', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' } }, [
          e('div', { key: 'date-col', className: 'form-group' }, [
            e('label', { className: 'form-label' }, 'Date'),
            e('input', { type: 'date', className: 'form-control', value: date, onChange: (ev) => setDate(ev.target.value) })
          ]),
          e('div', { key: 'slot-col', className: 'form-group' }, [
            e('label', { className: 'form-label' }, 'Time Slot'),
            e('select', { className: 'form-control', value: timeSlot, onChange: (ev) => setTimeSlot(ev.target.value) }, [
              e('option', { key: 't1' }, '09:00 AM'),
              e('option', { key: 't2' }, '10:30 AM'),
              e('option', { key: 't3' }, '02:00 PM'),
              e('option', { key: 't4' }, '04:30 PM')
            ])
          ])
        ]),
        e('button', {
          className: 'btn btn-primary',
          style: { width: '100%', justifyContent: 'center' },
          onClick: () => setStep(2)
        }, 'Continue to Contact Details ', e('i', { className: 'fas fa-arrow-right' }))
      ]) :

      e('form', { key: 'step2', onSubmit: handleSubmit }, [
        e('div', { className: 'form-group', style: { marginBottom: '14px' } }, [
          e('label', { className: 'form-label' }, 'Full Name *'),
          e('input', { type: 'text', className: 'form-control', placeholder: 'e.g. John Doe', value: name, onChange: (ev) => setName(ev.target.value), required: true })
        ]),
        e('div', { className: 'form-row', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' } }, [
          e('div', { key: 'ph', className: 'form-group' }, [
            e('label', { className: 'form-label' }, 'Phone *'),
            e('input', { type: 'tel', className: 'form-control', placeholder: '+1 (555) 000-0000', value: phone, onChange: (ev) => setPhone(ev.target.value), required: true })
          ]),
          e('div', { key: 'em', className: 'form-group' }, [
            e('label', { className: 'form-label' }, 'Email *'),
            e('input', { type: 'email', className: 'form-control', placeholder: 'john@example.com', value: email, onChange: (ev) => setEmail(ev.target.value), required: true })
          ])
        ]),
        e('div', { style: { display: 'flex', gap: '12px', marginTop: '20px' } }, [
          e('button', { key: 'back', type: 'button', className: 'btn btn-outline', onClick: () => setStep(1) }, 'Back'),
          e('button', { key: 'confirm', type: 'submit', className: 'btn btn-primary', style: { flex: 1, justifyContent: 'center' } }, e('i', { className: 'fas fa-check' }), ' Confirm Booking')
        ])
      ])
    ]);
  }

  // ============================================
  // 2. REACT DOCTOR FILTER & SEARCH SYSTEM
  // ============================================
  function DoctorFilterWidget() {
    const [selectedDept, setSelectedDept] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const departments = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Ophthalmology', 'Oncology'];

    const filteredDoctors = DOCTORS_DATA.filter(doc => {
      const matchesDept = selectedDept === 'All' || doc.dept === selectedDept;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });

    return e('div', { className: 'react-doctor-filter-container', style: { marginTop: '20px' } }, [
      e('div', { key: 'controls', style: { display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' } }, [
        e('div', { key: 'tabs', style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
          departments.map(dept => e('button', {
            key: dept,
            className: `btn ${selectedDept === dept ? 'btn-primary' : 'btn-outline'}`,
            style: { padding: '8px 18px', fontSize: '0.85rem', borderRadius: '50px' },
            onClick: () => setSelectedDept(dept)
          }, dept))
        ),
        e('div', { key: 'search', style: { position: 'relative', width: '100%', maxWidth: '280px' } }, [
          e('input', {
            type: 'text',
            className: 'form-control',
            placeholder: 'Search doctor or specialty...',
            value: searchQuery,
            onChange: (ev) => setSearchQuery(ev.target.value),
            style: { paddingRight: '36px', borderRadius: '50px' }
          }),
          e('i', { className: 'fas fa-search', style: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } })
        ])
      ]),

      filteredDoctors.length === 0 ? e('div', { key: 'nodata', className: 'text-center', style: { padding: '40px', color: 'var(--text-muted)' } }, [
        e('i', { className: 'fas fa-user-md', style: { fontSize: '3rem', marginBottom: '12px', opacity: '0.4' } }),
        e('p', {}, 'No specialists match your search criteria.')
      ]) :

      e('div', { key: 'grid', className: 'grid grid-3', style: { gap: '24px' } },
        filteredDoctors.map(doc => e('div', { key: doc.id, className: 'card doctor-card', style: { background: 'var(--bg-white)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' } }, [
          e('div', { key: 'img-wrap', className: 'doctor-img-wrap' }, [
            e('img', { src: doc.image, alt: doc.name, loading: 'lazy' }),
            e('div', { className: 'doctor-overlay' }, [
              e('div', { className: 'doctor-social' }, [
                e('a', { href: '#', 'aria-label': 'LinkedIn' }, e('i', { className: 'fab fa-linkedin-in' })),
                e('a', { href: '#', 'aria-label': 'Twitter' }, e('i', { className: 'fab fa-twitter' })),
                e('a', { href: 'pages/contact.html', 'aria-label': 'Email' }, e('i', { className: 'fas fa-envelope' }))
              ])
            ])
          ]),
          e('div', { key: 'info', className: 'doctor-info', style: { padding: '20px' } }, [
            e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' } }, [
              e('span', { className: 'tag', style: { fontSize: '0.72rem' } }, doc.status),
              e('span', { style: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' } }, e('i', { className: 'fas fa-star', style: { color: '#ffb703', marginRight: '4px' } }), doc.rating)
            ]),
            e('h3', { style: { fontSize: '1.1rem', margin: '4px 0' } }, doc.name),
            e('p', { className: 'doctor-specialty', style: { fontSize: '0.88rem', color: 'var(--primary)', fontWeight: '600' } }, doc.specialty),
            e('p', { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' } }, `Experience: ${doc.exp}`)
          ])
        ]))
      )
    ]);
  }

  // Mount components when DOM is ready
  function initReactWidgets() {
    const apptMount = document.getElementById('react-appointment-widget');
    if (apptMount) {
      const root = ReactDOM.createRoot(apptMount);
      root.render(e(AppointmentWidget));
    }

    const docMount = document.getElementById('react-doctor-filter-widget');
    if (docMount) {
      const root = ReactDOM.createRoot(docMount);
      root.render(e(DoctorFilterWidget));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactWidgets);
  } else {
    initReactWidgets();
  }
})();
