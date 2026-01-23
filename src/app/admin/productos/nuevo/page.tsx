'use client';

// ============================================
// ADMIN - NUEVO PRODUCTO (FORMULARIO EMPRESARIAL)
// ============================================

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/stores/productsStore';
import { getCategories } from '@/stores/categoriesStore';

export default function NuevoProductoPage() {
    const router = useRouter();
    const [tieneVariantes, setTieneVariantes] = useState(false);
    const [imagenProducto, setImagenProducto] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    // Load categories from store
    useEffect(() => {
        const cats = getCategories();
        setCategories(cats.filter(c => c.status === 'Activo').map(c => c.name));
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        codigoBarras: '',
        categoria: '',
        descripcion: '',
        precioCompra: '',
        precioVenta: '',
        stockActual: '0',
        stockMinimo: '5',
        marca: '',
        genero: 'Unisex',
        gramaje: '',
        unidadMedida: 'pz',
        sku: '',
        precioMayoreo: '',
        cantidadMayoreo: ''
    });

    // Variants state
    const [variantes, setVariantes] = useState<{
        id: string;
        atributo: string;
        valor: string;
        precio: string;
        stock: string;
        sku: string;
    }[]>([]);

    const unidadesMedida = [
        { value: 'pz', label: 'Pieza (pz)' },
        { value: 'kg', label: 'Kilogramo (kg)' },
        { value: 'g', label: 'Gramo (g)' },
        { value: 'lt', label: 'Litro (lt)' },
        { value: 'ml', label: 'Mililitro (ml)' },
        { value: 'mt', label: 'Metro (mt)' },
        { value: 'cm', label: 'Centímetro (cm)' },
        { value: 'caja', label: 'Caja' },
        { value: 'paq', label: 'Paquete' },
        { value: 'docena', label: 'Docena' }
    ];

    const atributosVariante = ['Talla', 'Color', 'Tamaño', 'Sabor', 'Material', 'Presentación'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProduct = () => {
        // Validate required fields
        if (!formData.nombre.trim()) {
            alert('Por favor ingresa el nombre del producto');
            return;
        }
        if (!formData.precioVenta || parseFloat(formData.precioVenta) <= 0) {
            alert('Por favor ingresa un precio de venta válido');
            return;
        }

        setIsSubmitting(true);

        // Save to localStorage store
        const newProduct = addProduct({
            name: formData.nombre,
            category: formData.categoria || 'Sin categoría',
            stock: parseInt(formData.stockActual) || 0,
            precio: parseFloat(formData.precioVenta),
            precioCompra: parseFloat(formData.precioCompra) || 0,
            codigoBarras: formData.codigoBarras,
            descripcion: formData.descripcion,
            imagen: imagenProducto || undefined,
            marca: formData.marca,
            genero: formData.genero
        });

        console.log('Producto creado:', newProduct);
        alert(`Producto "${formData.nombre}" creado exitosamente!`);
        router.push('/admin/productos');
    };

    // Barcode scanner simulation
    const handleBarcodeScan = () => {
        setShowBarcodeScanner(true);
        // Focus on hidden input for hardware scanner
        setTimeout(() => barcodeInputRef.current?.focus(), 100);
    };

    const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const scannedCode = (e.target as HTMLInputElement).value;
            if (scannedCode) {
                setFormData(prev => ({ ...prev, codigoBarras: scannedCode }));
                setShowBarcodeScanner(false);
            }
        }
    };

    const generateRandomBarcode = () => {
        const barcode = '7501' + Math.random().toString().substr(2, 9);
        setFormData(prev => ({ ...prev, codigoBarras: barcode }));
        setShowBarcodeScanner(false);
    };

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagenProducto(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    };

    const removeImage = () => {
        setImagenProducto(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="new-product-page">
            {/* Barcode Scanner Modal */}
            {showBarcodeScanner && (
                <div className="modal-overlay" onClick={() => setShowBarcodeScanner(false)}>
                    <div className="modal-content barcode-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Escanear Código de Barras</h3>
                            <button className="modal-close" onClick={() => setShowBarcodeScanner(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="scanner-animation">
                                <svg width="120" height="80" viewBox="0 0 120 80">
                                    <rect x="5" y="10" width="3" height="60" fill="#1e293b" />
                                    <rect x="12" y="10" width="5" height="60" fill="#1e293b" />
                                    <rect x="22" y="10" width="2" height="60" fill="#1e293b" />
                                    <rect x="28" y="10" width="6" height="60" fill="#1e293b" />
                                    <rect x="38" y="10" width="3" height="60" fill="#1e293b" />
                                    <rect x="45" y="10" width="4" height="60" fill="#1e293b" />
                                    <rect x="53" y="10" width="2" height="60" fill="#1e293b" />
                                    <rect x="60" y="10" width="5" height="60" fill="#1e293b" />
                                    <rect x="70" y="10" width="3" height="60" fill="#1e293b" />
                                    <rect x="78" y="10" width="2" height="60" fill="#1e293b" />
                                    <rect x="85" y="10" width="6" height="60" fill="#1e293b" />
                                    <rect x="95" y="10" width="3" height="60" fill="#1e293b" />
                                    <rect x="102" y="10" width="4" height="60" fill="#1e293b" />
                                    <rect x="110" y="10" width="5" height="60" fill="#1e293b" />
                                    <line x1="0" y1="40" x2="120" y2="40" stroke="#ef4444" strokeWidth="2" className="scanner-line" />
                                </svg>
                            </div>
                            <p className="scanner-text">Escanea el código de barras con tu lector...</p>
                            <input
                                ref={barcodeInputRef}
                                type="text"
                                placeholder="O escribe el código manualmente"
                                className="barcode-input"
                                onKeyDown={handleBarcodeInput}
                            />
                            <div className="scanner-actions">
                                <button className="btn-secondary" onClick={generateRandomBarcode}>
                                    Generar Código Automático
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header">
                <div>
                    <Link href="/admin/productos" className="back-link">← Volver a Productos</Link>
                    <h1>Nuevo Producto</h1>
                </div>
                <div className="header-actions">
                    <Link href="/admin/productos" className="btn-cancel">Cancelar</Link>
                    <button
                        className="btn-save"
                        onClick={handleCreateProduct}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creando...' : 'Crear producto'}
                    </button>
                </div>
            </div>

            <div className="form-container">
                {/* GENERAL INFO */}
                <div className="form-section">
                    <div className="form-row split-2-1">
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Ej. Agua Mineral 500ml"
                                value={formData.nombre}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Código de Barras</label>
                            <div className="input-with-action">
                                <input
                                    type="text"
                                    name="codigoBarras"
                                    placeholder="Escanea o escribe..."
                                    value={formData.codigoBarras}
                                    onChange={handleInputChange}
                                />
                                <button className="btn-icon-inside" title="Escanear" onClick={handleBarcodeScan} type="button">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                            <option value="">Seleccionar categoría...</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Detalles del producto..."
                            rows={3}
                            value={formData.descripcion}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    {/* IMAGEN DEL PRODUCTO */}
                    <div className="form-group">
                        <label>Imagen del Producto</label>
                        <div
                            className={`image-upload-zone ${isDragging ? 'dragging' : ''} ${imagenProducto ? 'has-image' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagenProducto ? (
                                <div className="image-preview">
                                    <img src={imagenProducto} alt="Vista previa" />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                    <span className="upload-text">Arrastra una imagen o haz clic para seleccionar</span>
                                    <span className="upload-hint">PNG, JPG o WEBP (máx. 5MB)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <p className="image-help-text">Esta imagen se mostrará en el panel de Nueva Venta (POS)</p>
                    </div>
                </div>


                {/* PRICING & STOCK */}
                <div className="form-section">
                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Precio de Compra * (Costo)</label>
                            <div className="money-input">
                                <span>$</span>
                                <input
                                    type="number"
                                    name="precioCompra"
                                    placeholder="0.00"
                                    value={formData.precioCompra}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Precio de Venta *</label>
                            <div className="money-input">
                                <span>$</span>
                                <input
                                    type="number"
                                    name="precioVenta"
                                    placeholder="0.00"
                                    value={formData.precioVenta}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Stock Actual</label>
                            <input
                                type="number"
                                name="stockActual"
                                value={formData.stockActual}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock Mínimo</label>
                            <input
                                type="number"
                                name="stockMinimo"
                                value={formData.stockMinimo}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* WHOLESALE PRICING */}
                    <h3 className="section-title" style={{ marginTop: '1.25rem' }}>Precio Mayoreo (Opcional)</h3>
                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Precio Mayoreo</label>
                            <div className="money-input">
                                <span>$</span>
                                <input
                                    type="number"
                                    name="precioMayoreo"
                                    placeholder="0.00"
                                    value={formData.precioMayoreo || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Cantidad Mínima Mayoreo</label>
                            <input
                                type="number"
                                name="cantidadMayoreo"
                                placeholder="Ej: 6"
                                value={formData.cantidadMayoreo || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                        El precio de mayoreo se aplica cuando el cliente compra esta cantidad o más.
                    </p>
                </div>

                {/* ATTRIBUTES */}
                <div className="form-section">
                    <h3 className="section-title">Características (Opcional)</h3>
                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Marca</label>
                            <select><option>Seleccionar...</option><option>Coca Cola</option><option>Nike</option></select>
                        </div>
                        <div className="form-group">
                            <label>Género</label>
                            <select><option>Unisex</option><option>Hombre</option><option>Mujer</option></select>
                        </div>
                    </div>
                </div>

                {/* GRAMAJE / MEDIDAS */}
                <div className="form-section">
                    <h3 className="section-title">Gramaje / Medidas</h3>
                    <div className="form-row split-3">
                        <div className="form-group">
                            <label>Contenido / Cantidad</label>
                            <input
                                type="text"
                                name="gramaje"
                                placeholder="Ej: 500, 1, 250"
                                value={formData.gramaje}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Unidad de Medida</label>
                            <select
                                name="unidadMedida"
                                value={formData.unidadMedida}
                                onChange={handleInputChange}
                            >
                                {unidadesMedida.map(u => (
                                    <option key={u.value} value={u.value}>{u.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>SKU (Código Interno)</label>
                            <input
                                type="text"
                                name="sku"
                                placeholder="SKU-001"
                                value={formData.sku}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Ejemplo: "500 g", "1 lt", "250 ml", "1 pz"
                    </p>
                </div>

                {/* VARIANTS TOGGLE */}
                <div className="form-section variants-section">
                    <div className="toggle-row">
                        <div className="toggle-switch">
                            <input type="checkbox" id="variants" checked={tieneVariantes} onChange={e => setTieneVariantes(e.target.checked)} />
                            <label htmlFor="variants"></label>
                        </div>
                        <div className="toggle-label">
                            <span className="toggle-title">Producto con Variantes</span>
                            <span className="toggle-desc">Habilita tallas, colores u otras combinaciones</span>
                        </div>
                    </div>

                    {tieneVariantes && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Variantes del Producto</h4>
                                <button
                                    type="button"
                                    onClick={() => setVariantes([...variantes, { id: Date.now().toString(), atributo: 'Talla', valor: '', precio: formData.precioVenta, stock: '0', sku: '' }])}
                                    style={{ padding: '0.5rem 1rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Agregar Variante
                                </button>
                            </div>

                            {variantes.length === 0 ? (
                                <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                                    <p style={{ margin: 0 }}>No hay variantes. Haz clic en "Agregar Variante" para comenzar.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {variantes.map((v, idx) => (
                                        <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px 120px 40px', gap: '0.75rem', alignItems: 'end', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Atributo</label>
                                                <select
                                                    value={v.atributo}
                                                    onChange={e => {
                                                        const updated = [...variantes];
                                                        updated[idx].atributo = e.target.value;
                                                        setVariantes(updated);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                                >
                                                    {atributosVariante.map(a => <option key={a} value={a}>{a}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Valor</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Grande, Rojo"
                                                    value={v.valor}
                                                    onChange={e => {
                                                        const updated = [...variantes];
                                                        updated[idx].valor = e.target.value;
                                                        setVariantes(updated);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Precio</label>
                                                <input
                                                    type="number"
                                                    value={v.precio}
                                                    onChange={e => {
                                                        const updated = [...variantes];
                                                        updated[idx].precio = e.target.value;
                                                        setVariantes(updated);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Stock</label>
                                                <input
                                                    type="number"
                                                    value={v.stock}
                                                    onChange={e => {
                                                        const updated = [...variantes];
                                                        updated[idx].stock = e.target.value;
                                                        setVariantes(updated);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>SKU</label>
                                                <input
                                                    type="text"
                                                    placeholder="SKU-VAR"
                                                    value={v.sku}
                                                    onChange={e => {
                                                        const updated = [...variantes];
                                                        updated[idx].sku = e.target.value;
                                                        setVariantes(updated);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVariantes(variantes.filter((_, i) => i !== idx))}
                                                style={{ padding: '0.5rem', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', height: '34px' }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .new-product-page { max-width: 900px; margin: 0 auto; }
                
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .back-link { font-size: 0.85rem; color: #64748b; text-decoration: none; margin-bottom: 0.5rem; display: block; }
                .page-header h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0; }
                
                .header-actions { display: flex; gap: 1rem; }
                .btn-cancel { padding: 0.75rem 1.5rem; border: 1px solid #e2e8f0; background: #fff; color: #64748b; border-radius: 8px; font-weight: 600; text-decoration: none; }
                .btn-save { padding: 0.75rem 1.5rem; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
                .btn-save:hover { background: #1d4ed8; }

                .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
                
                .form-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .section-title { font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; font-weight: 500; }

                .form-group { margin-bottom: 1.25rem; }
                .form-group:last-child { margin-bottom: 0; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: #334155; }
                
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s;
                    background: #fff;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .form-row { display: flex; gap: 1.5rem; }
                .split-2 { grid-template-columns: 1fr 1fr; display: grid; }
                .split-2-1 { display: grid; grid-template-columns: 2fr 1fr; }
                .split-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

                .input-with-action { position: relative; display: flex; }
                .input-with-action input { padding-right: 3rem; }
                .btn-icon-inside { position: absolute; right: 0; top: 0; bottom: 0; width: 3rem; background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .btn-icon-inside:hover { color: #2563eb; }

                .money-input { position: relative; }
                .money-input span { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; font-weight: 600; }
                .money-input input { padding-left: 2rem; }

                .variants-section { background: #f8fafc; border: 1px solid #e2e8f0; }
                .toggle-row { display: flex; align-items: flex-start; gap: 1rem; }
                
                .toggle-switch { position: relative; width: 44px; height: 24px; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .toggle-switch label { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
                .toggle-switch label:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                .toggle-switch input:checked + label { background-color: #2563eb; }
                .toggle-switch input:checked + label:before { transform: translateX(20px); }

                .toggle-label { display: flex; flex-direction: column; }
                .toggle-title { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
                .toggle-desc { font-size: 0.85rem; color: #64748b; }

                @media (max-width: 768px) {
                    .form-row, .split-2, .split-2-1 { grid-template-columns: 1fr; }
                }

                /* Image Upload Styles */
                .image-upload-zone {
                    border: 2px dashed #e2e8f0;
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #fafbfc;
                }
                .image-upload-zone:hover {
                    border-color: #2563eb;
                    background: #f0f4ff;
                }
                .image-upload-zone.dragging {
                    border-color: #2563eb;
                    background: #eff6ff;
                    transform: scale(1.01);
                }
                .image-upload-zone.has-image {
                    padding: 1rem;
                    border-style: solid;
                    border-color: #e2e8f0;
                    background: #fff;
                }

                .upload-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    color: #94a3b8;
                }
                .upload-placeholder svg {
                    opacity: 0.6;
                }
                .upload-text {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #64748b;
                }
                .upload-hint {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                .image-preview {
                    position: relative;
                    display: inline-block;
                }
                .image-preview img {
                    max-width: 200px;
                    max-height: 200px;
                    border-radius: 8px;
                    object-fit: cover;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .remove-image-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 28px;
                    height: 28px;
                    background: #ef4444;
                    color: white;
                    border: 2px solid white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                }
                .remove-image-btn:hover {
                    background: #dc2626;
                    transform: scale(1.1);
                }

                .image-help-text {
                    margin-top: 0.5rem;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-style: italic;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .modal-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e293b;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                .modal-close:hover { color: #1e293b; }
                .modal-body {
                    padding: 2rem;
                    text-align: center;
                }
                .scanner-animation {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: center;
                }
                .scanner-line {
                    animation: scan 1.5s ease-in-out infinite;
                }
                @keyframes scan {
                    0%, 100% { transform: translateY(-15px); opacity: 1; }
                    50% { transform: translateY(15px); opacity: 0.5; }
                }
                .scanner-text {
                    color: #64748b;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }
                .barcode-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                    text-align: center;
                    margin-bottom: 1rem;
                }
                .barcode-input:focus {
                    border-color: #2563eb;
                    outline: none;
                }
                .scanner-actions {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: center;
                }
                .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    background: #f1f5f9;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover {
                    background: #e2e8f0;
                }
                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
