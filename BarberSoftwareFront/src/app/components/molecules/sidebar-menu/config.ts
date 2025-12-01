export const MENU_CONFIG = {
    client: [
        { link: '/cliente/inicio', iconClass: 'bi bi-house-door-fill', label: 'Principal' },
        { link: '/cliente/servicios', iconClass: 'bi bi-scissors', label: 'Servicios' },
        { link: '/cliente/reservas', iconClass: 'bi bi-bell-fill', label: 'Mis Reservas' }
    ],
    admin: [
        { link: '/admin/inicio', iconClass: 'bi bi-house-door-fill', label: 'Principal' },
        { link: '/admin/servicios', iconClass: 'bi bi-people-fill', label: 'Servicios' },
        { link: '/admin/reservas', iconClass: 'bi bi-calendar-check-fill', label: 'Reservas' },
        { link: '/admin/barberos', iconClass: 'bi bi-person-fill-gear', label: 'Gestión Barberos' },
        { link: '/admin/reportes', iconClass: 'bi bi-file-earmark-bar-graph-fill', label: 'Reportes' }
    ],
    barber: [
        { link: '/barbero/inicio', iconClass: 'bi bi-house-door-fill', label: 'Principal' },
        { link: '/barbero/servicios', iconClass: 'bi bi-scissors', label: 'Servicios' },
        { link: '/barbero/reservas', iconClass: 'bi bi-bell-fill', label: 'Mis Reservas' }
    ]
};
