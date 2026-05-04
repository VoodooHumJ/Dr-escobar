/**
 * CMS Product Loader
 * Handles localized rendering, loading states, and structured data.
 */

const CMS_PRODUCT = {
    async init() {
        const containers = {
            noticias: document.getElementById('noticias-container'),
            casos: document.getElementById('casos-container')
        };

        // Show loading states
        Object.values(containers).forEach(el => {
            if (el) el.innerHTML = '<div class="cms-loading">Cargando información actualizada...</div>';
        });

        try {
            const response = await fetch('/dist-content/index.json');
            if (!response.ok) throw new Error('Failed to load content index');
            const data = await response.json();

            this.renderNoticias(containers.noticias, data.noticias);
            this.renderCasos(containers.casos, data['casos-clinicos']);
        } catch (error) {
            console.error('CMS Init Error:', error);
            Object.values(containers).forEach(el => {
                if (el) el.innerHTML = '<div class="cms-error">Temporalmente fuera de servicio.</div>';
            });
        }
    },

    renderNoticias(container, items) {
        if (!container) return;
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="cms-empty">Próximamente más novedades.</div>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="cms-card news-card">
                <img src="${item.image}" alt="${item.title}" class="cms-card-img">
                <div class="cms-card-body">
                    <span class="cms-date">${this.formatDate(item.date)}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="#" class="btn btn--secondary" onclick="CMS_PRODUCT.showDetail('${item.id}', 'noticias')">Leer más</a>
                </div>
            </div>
        `).join('');
    },

    renderCasos(container, items) {
        if (!container) return;
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="cms-empty">No hay casos clínicos registrados.</div>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="cms-card case-card">
                <div class="cms-card-badge">${item.category}</div>
                <div class="cms-card-body">
                    <h3>${item.title}</h3>
                    <div class="case-brief">
                        <strong>Motivo:</strong> ${item.motive}<br>
                        <strong>Diagnóstico:</strong> ${item.diagnosis}
                    </div>
                    <button class="btn btn--primary" onclick="CMS_PRODUCT.toggleCase('${item.id}')">Ver evolución completa</button>
                    <div id="case-detail-${item.id}" class="case-detail" style="display:none; margin-top: 15px;">
                        <div class="case-section">
                            <h4>Tratamiento</h4>
                            ${item.treatment}
                        </div>
                        <div class="case-section">
                            <h4>Evolución</h4>
                            ${item.evolution}
                        </div>
                        ${item.gallery ? `
                            <div class="case-gallery">
                                ${item.gallery.map(img => `<img src="${img.image}" alt="Galería">`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    toggleCase(id) {
        const el = document.getElementById(`case-detail-${id}`);
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => CMS_PRODUCT.init());
