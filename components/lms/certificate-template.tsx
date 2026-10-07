import React from 'react';

export type CertificateMode =
    | 'educacion_continua'
    | 'empresa_sin_franquicia'
    | 'empresa_con_franquicia_sence';

export interface CertificateTemplateProps {
    studentName: string;
    studentRun?: string | null;
    courseTitle: string;
    modalityLabel: string; // Ej: "e-learning sincrónica", "asincrónica", "presencial", etc.
    startDate: string;
    endDate: string;
    durationHours: number | string;
    finalGrade?: string | number | null;
    attendancePercent?: string | number | null;
    issuedAt: string;
    certificateCode: string;
    verificationUrl: string;
    qrCodeUrl?: string | null;

    mode: CertificateMode;

    organizationName?: string;
    organizationRut?: string;
    participantInstitutionName?: string | null;

    signerName: string;
    signerRole: string;
    signerSignatureUrl?: string | null;

    otecName?: string;
    otecRut?: string;
    senceRegistrationNumber?: string | null;
    nchCertificationText?: string | null;

    logoUrl?: string | null;
    lumenLogoUrl?: string | null;

    city?: string | null;
}

const DEFAULT_OTEC_NAME = 'El Poder de Crear Capacitación Limitada';
const DEFAULT_OTEC_RUT = '77.740.191-2';
const DEFAULT_NCH_TEXT = 'Sistema de Gestión certificado bajo la NCh 2728:2015';

function getModeBadge(mode: CertificateMode): string {
    switch (mode) {
        case 'educacion_continua':
            return 'Educación Continua';
        case 'empresa_sin_franquicia':
            return 'Capacitación Corporativa';
        case 'empresa_con_franquicia_sence':
            return 'Franquicia Tributaria SENCE';
        default:
            return 'Certificación';
    }
}

function getMainBodyText(props: CertificateTemplateProps): React.ReactNode {
    const {
        mode,
        studentName,
        studentRun,
        courseTitle,
        modalityLabel,
        startDate,
        endDate,
        durationHours,
        finalGrade,
        attendancePercent,
        participantInstitutionName,
        otecName,
    } = props;

    const gradeText =
        finalGrade !== null && finalGrade !== undefined && `${finalGrade}`.trim() !== ''
            ? (
                <>
                    , obteniendo una calificación final de{' '}
                    <strong>{finalGrade}</strong>
                </>
            )
            : null;

    const attendanceText =
        attendancePercent !== null &&
            attendancePercent !== undefined &&
            `${attendancePercent}`.trim() !== ''
            ? (
                <>
                    {' '}y una asistencia de <strong>{attendancePercent}%</strong>
                </>
            )
            : null;

    const runBlock =
        studentRun && studentRun.trim() !== '' ? (
            <>
                RUN <strong>{studentRun}</strong>
            </>
        ) : (
            <>identificado/a en nuestros registros académicos</>
        );

    if (mode === 'educacion_continua') {
        return (
            <>
                <p style={styles.bodyParagraph}>
                    <strong>{otecName || DEFAULT_OTEC_NAME}</strong> certifica que
                </p>

                <p style={styles.studentName}>{studentName}</p>

                <p style={styles.studentMeta}>{runBlock}</p>

                <p style={styles.bodyParagraph}>
                    ha aprobado satisfactoriamente el curso{' '}
                    <strong>{courseTitle}</strong>, ejecutado en modalidad{' '}
                    <strong>{modalityLabel}</strong>, desarrollado entre el{' '}
                    <strong>{startDate}</strong> y el <strong>{endDate}</strong>, con una
                    duración total de <strong>{durationHours} horas cronológicas</strong>
                    {gradeText}
                    {attendanceText}.
                </p>
            </>
        );
    }

    if (mode === 'empresa_sin_franquicia') {
        return (
            <>
                <p style={styles.bodyParagraph}>
                    <strong>{otecName || DEFAULT_OTEC_NAME}</strong> certifica que
                </p>

                <p style={styles.studentName}>{studentName}</p>

                <p style={styles.studentMeta}>{runBlock}</p>

                <p style={styles.bodyParagraph}>
                    ha aprobado satisfactoriamente el curso{' '}
                    <strong>{courseTitle}</strong>, impartido en modalidad{' '}
                    <strong>{modalityLabel}</strong> para colaboradores de{' '}
                    <strong>{participantInstitutionName || 'la institución participante'}</strong>,
                    desarrollado entre el <strong>{startDate}</strong> y el{' '}
                    <strong>{endDate}</strong>, con una duración total de{' '}
                    <strong>{durationHours} horas cronológicas</strong>
                    {gradeText}
                    {attendanceText}.
                </p>
            </>
        );
    }

    return (
        <>
            <p style={styles.bodyParagraph}>
                <strong>{otecName || DEFAULT_OTEC_NAME}</strong> certifica que
            </p>

            <p style={styles.studentName}>{studentName}</p>

            <p style={styles.studentMeta}>{runBlock}</p>

            <p style={styles.bodyParagraph}>
                ha aprobado satisfactoriamente el curso{' '}
                <strong>{courseTitle}</strong>, ejecutado en modalidad{' '}
                <strong>{modalityLabel}</strong> para colaboradores de{' '}
                <strong>{participantInstitutionName || 'la institución participante'}</strong>,
                desarrollado entre el <strong>{startDate}</strong> y el{' '}
                <strong>{endDate}</strong>, con una duración total de{' '}
                <strong>{durationHours} horas cronológicas</strong>
                {gradeText}
                {attendanceText}.
            </p>

            <div style={styles.noticeBox}>
                <p style={styles.noticeText}>
                    Actividad emitida bajo esquema de capacitación asociado a{' '}
                    <strong>Franquicia Tributaria SENCE</strong>, conforme a la trazabilidad
                    académica, administrativa y de asistencia registrada por la entidad
                    ejecutora.
                </p>
            </div>
        </>
    );
}

export default function CertificateTemplate(props: CertificateTemplateProps) {
    const {
        mode,
        issuedAt,
        certificateCode,
        verificationUrl,
        qrCodeUrl,
        signerName,
        signerRole,
        signerSignatureUrl,
        otecName,
        otecRut,
        senceRegistrationNumber,
        nchCertificationText,
        logoUrl,
        lumenLogoUrl,
        city,
    } = props;

    const modeBadge = getModeBadge(mode);
    const resolvedOtecName = otecName || DEFAULT_OTEC_NAME;
    const resolvedOtecRut = otecRut || DEFAULT_OTEC_RUT;
    const resolvedNchText = nchCertificationText || DEFAULT_NCH_TEXT;

    return (
        <div style={styles.page}>
            <div style={styles.outerFrame}>
                <div style={styles.topAccentBar} />
                <div style={styles.cornerAccentTop} />
                <div style={styles.cornerAccentBottom} />

                <header style={styles.header}>
                    <div style={styles.brandBlock}>
                        <div style={styles.logoWrap}>
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo OTEC" style={styles.logoImage} />
                            ) : (
                                <div style={styles.logoFallback}>OTEC</div>
                            )}
                        </div>

                        <div style={styles.brandTextWrap}>
                            <div style={styles.brandEyebrow}>Organismo Técnico de Capacitación</div>
                            <div style={styles.brandName}>El Poder de Crear</div>
                        </div>
                    </div>

                    <div style={styles.rightBrandBlock}>
                        <div style={styles.modePill}>{modeBadge}</div>

                        {lumenLogoUrl ? (
                            <img src={lumenLogoUrl} alt="Corex Academia" style={styles.lumenLogo} />
                        ) : (
                            <div style={styles.lumenText}>Corex Academia</div>
                        )}
                    </div>
                </header>

                <main style={styles.main}>
                    <div style={styles.titleBlock}>
                        <div style={styles.officialLabel}>Certificado Oficial</div>
                        <h1 style={styles.title}>CERTIFICADO DE APROBACIÓN</h1>
                        <p style={styles.subtitle}>
                            Documento emitido digitalmente por la entidad capacitadora
                        </p>
                    </div>

                    <section style={styles.contentSection}>
                        {getMainBodyText({
                            ...props,
                            otecName: resolvedOtecName,
                        })}
                    </section>

                    <section style={styles.metadataGrid}>
                        <div style={styles.metaCard}>
                            <div style={styles.metaLabel}>Fecha de emisión</div>
                            <div style={styles.metaValue}>{issuedAt}</div>
                        </div>

                        <div style={styles.metaCard}>
                            <div style={styles.metaLabel}>Código del certificado</div>
                            <div style={styles.metaValue}>{certificateCode}</div>
                        </div>

                        <div style={styles.metaCard}>
                            <div style={styles.metaLabel}>Entidad emisora</div>
                            <div style={styles.metaValue}>{resolvedOtecName}</div>
                        </div>

                        <div style={styles.metaCard}>
                            <div style={styles.metaLabel}>RUT entidad emisora</div>
                            <div style={styles.metaValue}>{resolvedOtecRut}</div>
                        </div>
                    </section>

                    <section style={styles.footerZone}>
                        <div style={styles.signatureArea}>
                            <div style={styles.signatureBox}>
                                {signerSignatureUrl ? (
                                    <img
                                        src={signerSignatureUrl}
                                        alt="Firma"
                                        style={styles.signatureImage}
                                    />
                                ) : (
                                    <div style={styles.signaturePlaceholder} />
                                )}
                            </div>

                            <div style={styles.signatureLine} />
                            <div style={styles.signerName}>{signerName}</div>
                            <div style={styles.signerRole}>{signerRole}</div>
                            <div style={styles.signerOrg}>{resolvedOtecName}</div>
                        </div>

                        <div style={styles.verificationArea}>
                            <div style={styles.qrWrap}>
                                {qrCodeUrl ? (
                                    <img src={qrCodeUrl} alt="QR de verificación" style={styles.qrImage} />
                                ) : (
                                    <div style={styles.qrPlaceholder}>QR</div>
                                )}
                            </div>

                            <div style={styles.verificationTitle}>Verificación oficial</div>
                            <div style={styles.verificationCode}>{certificateCode}</div>
                            <div style={styles.verificationUrl}>{verificationUrl}</div>
                        </div>
                    </section>
                </main>

                <footer style={styles.footer}>
                    <div style={styles.footerLeft}>
                        <div style={styles.footerText}>{resolvedOtecName}</div>
                        <div style={styles.footerText}>RUT {resolvedOtecRut}</div>

                        {senceRegistrationNumber ? (
                            <div style={styles.footerText}>
                                Organismo Técnico de Capacitación reconocido. Registro {senceRegistrationNumber}
                            </div>
                        ) : null}

                        <div style={styles.footerText}>{resolvedNchText}</div>
                    </div>

                    <div style={styles.footerRight}>
                        {city ? <div style={styles.footerText}>{city}</div> : null}
                        <div style={styles.footerText}>Emitido en formato digital</div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        width: '100%',
        backgroundColor: '#eef2f7',
        padding: '32px',
        boxSizing: 'border-box',
        fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#0f172a',
    },
    outerFrame: {
        position: 'relative',
        width: '1123px',
        minHeight: '794px',
        margin: '0 auto',
        background:
            'linear-gradient(180deg, #ffffff 0%, #fbfcff 45%, #f8fafc 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.14)',
        border: '1px solid rgba(37, 99, 235, 0.08)',
    },
    topAccentBar: {
        width: '100%',
        height: '10px',
        background:
            'linear-gradient(90deg, #1d4ed8 0%, #2563eb 45%, #f97316 100%)',
    },
    cornerAccentTop: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '180px',
        height: '180px',
        background:
            'linear-gradient(135deg, rgba(37,99,235,0.14) 0%, rgba(249,115,22,0.14) 100%)',
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
    },
    cornerAccentBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '180px',
        height: '180px',
        background:
            'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(37,99,235,0.12) 100%)',
        clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '40px 48px 18px 48px',
    },
    brandBlock: {
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
    },
    logoWrap: {
        width: '72px',
        height: '72px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(15,23,42,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
    },
    logoImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    logoFallback: {
        fontSize: '20px',
        fontWeight: 800,
        color: '#1d4ed8',
        letterSpacing: '0.08em',
    },
    brandTextWrap: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    brandEyebrow: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#64748b',
    },
    brandName: {
        fontSize: '28px',
        fontWeight: 800,
        color: '#0f172a',
        lineHeight: 1.1,
    },
    rightBrandBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
    },
    modePill: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 16px',
        borderRadius: '999px',
        background: 'rgba(37, 99, 235, 0.08)',
        color: '#1d4ed8',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '0.02em',
        border: '1px solid rgba(37, 99, 235, 0.12)',
    },
    lumenLogo: {
        height: '32px',
        objectFit: 'contain',
    },
    lumenText: {
        fontSize: '24px',
        fontWeight: 800,
        letterSpacing: '0.18em',
        color: '#0f172a',
    },
    main: {
        padding: '0 48px 32px 48px',
    },
    titleBlock: {
        textAlign: 'center',
        marginTop: '6px',
        marginBottom: '28px',
    },
    officialLabel: {
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: '#f97316',
        marginBottom: '12px',
    },
    title: {
        margin: 0,
        fontSize: '46px',
        lineHeight: 1.08,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: '#0f172a',
    },
    subtitle: {
        margin: '12px 0 0 0',
        fontSize: '16px',
        color: '#475569',
    },
    contentSection: {
        maxWidth: '920px',
        margin: '0 auto 30px auto',
        textAlign: 'center',
    },
    bodyParagraph: {
        margin: '14px 0',
        fontSize: '22px',
        lineHeight: 1.8,
        color: '#1e293b',
    },
    studentName: {
        margin: '18px 0 8px 0',
        fontSize: '40px',
        lineHeight: 1.15,
        fontWeight: 800,
        color: '#1d4ed8',
        letterSpacing: '-0.03em',
    },
    studentMeta: {
        margin: '0 0 12px 0',
        fontSize: '18px',
        lineHeight: 1.6,
        color: '#475569',
    },
    noticeBox: {
        marginTop: '20px',
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)',
        border: '1px solid rgba(249, 115, 22, 0.2)',
    },
    noticeText: {
        margin: 0,
        fontSize: '15px',
        lineHeight: 1.7,
        color: '#9a3412',
    },
    metadataGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '14px',
        marginTop: '18px',
        marginBottom: '34px',
    },
    metaCard: {
        background: '#f8fafc',
        borderRadius: '18px',
        border: '1px solid rgba(15,23,42,0.06)',
        padding: '18px',
        minHeight: '92px',
        boxSizing: 'border-box',
    },
    metaLabel: {
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#64748b',
        marginBottom: '10px',
    },
    metaValue: {
        fontSize: '18px',
        fontWeight: 700,
        lineHeight: 1.4,
        color: '#0f172a',
        wordBreak: 'break-word',
    },
    footerZone: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '28px',
        alignItems: 'flex-end',
        marginTop: '6px',
    },
    signatureArea: {
        flex: 1,
        minWidth: 0,
        maxWidth: '60%',
    },
    signatureBox: {
        height: '88px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    signatureImage: {
        maxHeight: '80px',
        maxWidth: '220px',
        objectFit: 'contain',
    },
    signaturePlaceholder: {
        width: '220px',
        height: '50px',
        borderBottom: '1px dashed rgba(15,23,42,0.2)',
    },
    signatureLine: {
        width: '280px',
        borderBottom: '2px solid #0f172a',
        marginTop: '4px',
        marginBottom: '10px',
    },
    signerName: {
        fontSize: '18px',
        fontWeight: 800,
        color: '#0f172a',
    },
    signerRole: {
        marginTop: '4px',
        fontSize: '15px',
        fontWeight: 600,
        color: '#475569',
    },
    signerOrg: {
        marginTop: '4px',
        fontSize: '14px',
        color: '#64748b',
    },
    verificationArea: {
        width: '230px',
        background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid rgba(37, 99, 235, 0.15)',
        borderRadius: '20px',
        padding: '18px',
        boxSizing: 'border-box',
        textAlign: 'center',
    },
    qrWrap: {
        width: '120px',
        height: '120px',
        margin: '0 auto 14px auto',
        borderRadius: '12px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(15,23,42,0.08)',
    },
    qrImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    qrPlaceholder: {
        fontSize: '24px',
        fontWeight: 800,
        color: '#1d4ed8',
    },
    verificationTitle: {
        fontSize: '14px',
        fontWeight: 800,
        color: '#0f172a',
        marginBottom: '6px',
    },
    verificationCode: {
        fontSize: '18px',
        fontWeight: 800,
        color: '#1d4ed8',
        marginBottom: '8px',
        wordBreak: 'break-word',
    },
    verificationUrl: {
        fontSize: '11px',
        lineHeight: 1.5,
        color: '#475569',
        wordBreak: 'break-word',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
        padding: '0 48px 34px 48px',
        alignItems: 'flex-end',
    },
    footerLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxWidth: '72%',
    },
    footerRight: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'flex-end',
        textAlign: 'right',
    },
    footerText: {
        fontSize: '13px',
        lineHeight: 1.5,
        color: '#64748b',
    },
};