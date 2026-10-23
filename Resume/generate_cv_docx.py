import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_element(name):
    return OxmlElement(name)

def remove_table_borders(table):
    tblPr = table._tbl.tblPr
    tblBorders = parse_xml(
        r'<w:tblBorders %s>'
        r'  <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        r'  <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        r'  <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        r'  <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        r'  <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        r'  <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        r'</w:tblBorders>' % nsdecls('w')
    )
    tblPr.append(tblBorders)

def set_cell_margins(cell, top=0, bottom=0, left=0, right=0):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_header_underline(p, text, font_size=11):
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(text)
    run.bold = True
    run.font.name = 'Arial'
    run.font.size = Pt(font_size)
    run.font.underline = True
    run.font.color.rgb = RGBColor(0, 0, 0)

def add_bullet_item(p, text_segments, space_after: float = 2.0):
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.05
    p.paragraph_format.left_indent = Inches(0.18)
    p.paragraph_format.first_line_indent = Inches(-0.18)
    
    b_run = p.add_run('• ')
    b_run.font.name = 'Arial'
    b_run.font.size = Pt(8.5)
    b_run.font.color.rgb = RGBColor(40, 40, 40)
    
    for seg in text_segments:
        if isinstance(seg, tuple):
            txt, is_bold = seg
            r = p.add_run(txt)
            r.bold = is_bold
        else:
            r = p.add_run(seg)
        r.font.name = 'Arial'
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(30, 30, 30)

def build_cv():
    doc = Document()
    
    # 0.5 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.4)
        section.bottom_margin = Inches(0.4)
        section.left_margin = Inches(0.4)
        section.right_margin = Inches(0.4)
        section.page_width = Inches(8.27)  # A4
        section.page_height = Inches(11.69)
        
    # Base normal style
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(8.5)
    font.color.rgb = RGBColor(30, 30, 30)
    
    # 2-column table
    # Column 1: ~2.5 inches, Column 2: ~4.9 inches
    col1_w = Inches(2.45)
    col2_w = Inches(4.95)
    
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    remove_table_borders(table)
    
    row = table.rows[0]
    cell_left = row.cells[0]
    cell_right = row.cells[1]
    
    cell_left.width = col1_w
    cell_right.width = col2_w
    
    set_cell_margins(cell_left, top=0, bottom=0, left=0, right=140)
    set_cell_margins(cell_right, top=0, bottom=0, left=140, right=0)
    
    # ================= LEFT COLUMN =================
    # 1. Foto
    p_img = cell_left.paragraphs[0]
    p_img.paragraph_format.space_before = Pt(0)
    p_img.paragraph_format.space_after = Pt(8)
    if os.path.exists('avatar_cv.png'):
        p_img.add_run().add_picture('avatar_cv.png', width=Inches(2.2))
        
    # 2. Kontak Info
    contacts = [
        ('📞', ' 088706691442'),  # Or standard phone
        ('✉️', ' adridinan99@gmail.com'),
        ('🔗', ' linkedin.com/in/adridinan-najmi-faza'),
        ('💻', ' github.com/najmifaza')
    ]
    for icon, text in contacts:
        p_c = cell_left.add_paragraph()
        p_c.paragraph_format.space_before = Pt(0)
        p_c.paragraph_format.space_after = Pt(2)
        p_c.paragraph_format.line_spacing = 1.05
        r_txt = p_c.add_run(f'{icon}{text}')
        r_txt.font.name = 'Arial'
        r_txt.font.size = Pt(8)
        r_txt.font.color.rgb = RGBColor(50, 50, 50)
        
    # 3. EDUCATION
    p_edu_h = cell_left.add_paragraph()
    add_header_underline(p_edu_h, 'EDUCATION')
    
    # Study 1
    p_e1 = cell_left.add_paragraph()
    p_e1.paragraph_format.space_before = Pt(2)
    p_e1.paragraph_format.space_after = Pt(1)
    p_e1.paragraph_format.line_spacing = 1.05
    r = p_e1.add_run('2024 - Sekarang\nUniversitas Jenderal Soedirman\n')
    r.font.size = Pt(8.5)
    r_deg = p_e1.add_run('S1 Informatika')
    r_deg.bold = True
    r_deg.font.size = Pt(8.5)
    
    # Study 2
    p_e2 = cell_left.add_paragraph()
    p_e2.paragraph_format.space_before = Pt(4)
    p_e2.paragraph_format.space_after = Pt(2)
    p_e2.paragraph_format.line_spacing = 1.05
    r2 = p_e2.add_run('2018 - 2024\nPondok Modern Tazakka\n')
    r2.font.size = Pt(8.5)
    r2_deg = p_e2.add_run('KMI Curriculum Graduate')
    r2_deg.bold = True
    r2_deg.font.size = Pt(8.5)

    # 4. PENGHARGAAN
    p_awd_h = cell_left.add_paragraph()
    add_header_underline(p_awd_h, 'PENGHARGAAN')
    
    awards = [
        [('SiFest Hackathon Harkat Negri', True), (', Universitas Harkat Negri (2026)', False)],
        [('Koordinator IT', True), (', BEM Universitas Jenderal Soedirman (2026)', False)],
        [('Asisten Praktikum Basis Data', True), (', Universitas Jenderal Soedirman (2026)', False)],
        [('Data Classification with IBM Granite', True), (', IBM SkillsBuild & Hacktiv8 (2025)', False)],
        [('Soedirman Digital School: Web Dev', True), (', BEM Unsoed (2025)', False)]
    ]
    for awd in awards:
        p_a = cell_left.add_paragraph()
        add_bullet_item(p_a, awd, space_after=3)

    # 5. PROJEK
    p_prj_h = cell_left.add_paragraph()
    add_header_underline(p_prj_h, 'PROJEK')
    
    # Project 1: KilasTugas
    p_p1 = cell_left.add_paragraph()
    p_p1.paragraph_format.space_before = Pt(3)
    p_p1.paragraph_format.space_after = Pt(2)
    p_p1.paragraph_format.line_spacing = 1.05
    r_yr1 = p_p1.add_run('2026 | Web Application\n')
    r_yr1.font.size = Pt(8.5)
    r_t1 = p_p1.add_run('Full-stack Dev | KilasTugas')
    r_t1.bold = True
    r_t1.font.size = Pt(8.5)
    
    p_p1_b = cell_left.add_paragraph()
    add_bullet_item(p_p1_b, [
        'Membangun web app micro-pacing bertenaga AI pemecah silabus tugas jadi aksi harian terukur (React, FastAPI, MariaDB, IndexedDB).'
    ], space_after=3)

    # Project 2: URL Shortener
    p_p2 = cell_left.add_paragraph()
    p_p2.paragraph_format.space_before = Pt(3)
    p_p2.paragraph_format.space_after = Pt(2)
    p_p2.paragraph_format.line_spacing = 1.05
    r_yr2 = p_p2.add_run('2026 | Utility Web Platform\n')
    r_yr2.font.size = Pt(8.5)
    r_t2 = p_p2.add_run('Full-stack Dev | URL Shortener BEM')
    r_t2.bold = True
    r_t2.font.size = Pt(8.5)
    
    p_p2_b = cell_left.add_paragraph()
    add_bullet_item(p_p2_b, [
        'Mengembangkan sistem pemendek tautan resmi BEM Unsoed dengan custom slug, dynamic QR Code, dan proteksi admin (Next.js & Supabase).'
    ], space_after=3)

    # ================= RIGHT COLUMN =================
    # 1. Header Name & Role
    p_name = cell_right.paragraphs[0]
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(1)
    p_name.paragraph_format.line_spacing = 1.0
    r_name = p_name.add_run('ADRIDINAN NAJMI FAZA')
    r_name.bold = True
    r_name.font.name = 'Arial'
    r_name.font.size = Pt(18)
    
    p_role = cell_right.add_paragraph()
    p_role.paragraph_format.space_before = Pt(0)
    p_role.paragraph_format.space_after = Pt(4)
    r_role = p_role.add_run('Web Developer & S1 Informatika')
    r_role.font.name = 'Arial'
    r_role.font.size = Pt(10.5)
    r_role.font.color.rgb = RGBColor(60, 60, 60)
    
    # Horizontal line below header
    p_line = cell_right.add_paragraph()
    p_line.paragraph_format.space_before = Pt(0)
    p_line.paragraph_format.space_after = Pt(6)
    pBrd = parse_xml(r'<w:pBdr %s><w:bottom w:val="single" w:sz="8" w:space="1" w:color="000000"/></w:pBdr>' % nsdecls('w'))
    p_line._p.get_or_add_pPr().append(pBrd)

    # 2. RINGKASAN PROFESIONAL
    p_sum_h = cell_right.add_paragraph()
    p_sum_h.paragraph_format.space_before = Pt(4)
    p_sum_h.paragraph_format.space_after = Pt(3)
    r_sum_t = p_sum_h.add_run('RINGKASAN PROFESIONAL')
    r_sum_t.bold = True
    r_sum_t.font.name = 'Arial'
    r_sum_t.font.size = Pt(10)
    
    p_sum_body = cell_right.add_paragraph()
    p_sum_body.paragraph_format.space_before = Pt(0)
    p_sum_body.paragraph_format.space_after = Pt(6)
    p_sum_body.paragraph_format.line_spacing = 1.1
    p_sum_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_sb = p_sum_body.add_run(
        'Mahasiswa S1 Informatika Universitas Jenderal Soedirman angkatan 2024 dengan spesialisasi rekayasa perangkat lunak web, integrasi kecerdasan buatan, dan operasional media digital. Berpengalaman membangun aplikasi web responsif dan skalabel (Next.js, React, FastAPI, PostgreSQL/MariaDB), memimpin tim teknologi pada platform Panggih Sedulur, serta menjabat Web Development Staff di BEM Unsoed. Terbiasa bekerja dengan deadline, mengelola konten digital, serta menerjemahkan kebutuhan fungsional menjadi sistem informasi yang terstruktur.'
    )
    r_sb.font.name = 'Arial'
    r_sb.font.size = Pt(8.5)
    r_sb.font.color.rgb = RGBColor(30, 30, 30)

    # 3. PENGALAMAN KERJA / MAGANG
    p_mag_h = cell_right.add_paragraph()
    add_header_underline(p_mag_h, 'PENGALAMAN MAGANG & PROFESIONAL')
    
    # Magang 1: Rumio.id
    p_m1 = cell_right.add_paragraph()
    p_m1.paragraph_format.space_before = Pt(3)
    p_m1.paragraph_format.space_after = Pt(1)
    p_m1.paragraph_format.line_spacing = 1.05
    r_m1_t = p_m1.add_run('Juni 2026 - Sekarang | Rumio.id\n')
    r_m1_t.font.size = Pt(8.5)
    r_m1_r = p_m1.add_run('Full-stack Web Developer')
    r_m1_r.bold = True
    r_m1_r.font.size = Pt(8.5)
    
    m1_bullets = [
        'Mengembangkan platform eksplorasi properti komprehensif menggunakan Next.js (App Router), Prisma ORM, dan Tailwind CSS.',
        'Mengimplementasikan fitur Virtual Tour 360° interaktif, autentikasi NextAuth, dashboard admin analitik, dan CMS blog.',
        'Mengoptimasi database untuk mengatasi masalah N+1 query serta menerapkan rate-limiting dan sanitasi XSS demi keamanan sistem.'
    ]
    for b in m1_bullets:
        p_b = cell_right.add_paragraph()
        add_bullet_item(p_b, [b], space_after=1.5)

    # Magang 2: Melintas.id
    p_m2 = cell_right.add_paragraph()
    p_m2.paragraph_format.space_before = Pt(3)
    p_m2.paragraph_format.space_after = Pt(1)
    p_m2.paragraph_format.line_spacing = 1.05
    r_m2_t = p_m2.add_run('2025 | PT Promedia Teknologi Indonesia (Melintas.id)\n')
    r_m2_t.font.size = Pt(8.5)
    r_m2_r = p_m2.add_run('Web Content Writer')
    r_m2_r.bold = True
    r_m2_r.font.size = Pt(8.5)
    
    p_m2_b = cell_right.add_paragraph()
    add_bullet_item(p_m2_b, ['Memproduksi dan mempublikasikan artikel berita terindeks SEO secara berkala pada portal media digital Melintas.id.'], space_after=2)

    # 4. PENGALAMAN ORGANISASI
    p_org_h = cell_right.add_paragraph()
    add_header_underline(p_org_h, 'PENGALAMAN ORGANISASI')
    
    # Org 1: BEM Unsoed
    p_o1 = cell_right.add_paragraph()
    p_o1.paragraph_format.space_before = Pt(3)
    p_o1.paragraph_format.space_after = Pt(1)
    p_o1.paragraph_format.line_spacing = 1.05
    r_o1_t = p_o1.add_run('Februari 2026 - Sekarang | BEM Universitas Jenderal Soedirman\n')
    r_o1_t.font.size = Pt(8.5)
    r_o1_r = p_o1.add_run('Web Development Staff')
    r_o1_r.bold = True
    r_o1_r.font.size = Pt(8.5)
    
    o1_bullets = [
        'Mengelola dan mengembangkan website resmi BEM-U via WordPress, merancang layout responsif dengan Elementor, serta injeksi HTML/CSS tingkat lanjut.',
        'Membangun ekosistem digital publikasi: sistem formulir pemesanan konten terpusat dan aplikasi penyingkat tautan (URL Shortener).'
    ]
    for b in o1_bullets:
        p_b = cell_right.add_paragraph()
        add_bullet_item(p_b, [b], space_after=1.5)

    # Org 2: Panggih Sedulur
    p_o2 = cell_right.add_paragraph()
    p_o2.paragraph_format.space_before = Pt(3)
    p_o2.paragraph_format.space_after = Pt(1)
    p_o2.paragraph_format.line_spacing = 1.05
    r_o2_t = p_o2.add_run('April 2026 - Sekarang | Panggih Sedulur\n')
    r_o2_t.font.size = Pt(8.5)
    r_o2_r = p_o2.add_run('IT Coordinator')
    r_o2_r.bold = True
    r_o2_r.font.size = Pt(8.5)
    
    o2_bullets = [
        'Bertanggung jawab penuh atas arsitektur dan pengembangan platform web yang terintegrasi langsung dengan database CRM.',
        'Mengimplementasikan Google OAuth, kuisioner interaktif dengan branching logic, serta sistem rekomendasi UKM Unsoed.'
    ]
    for b in o2_bullets:
        p_b = cell_right.add_paragraph()
        add_bullet_item(p_b, [b], space_after=1.5)

    # Org 3: OPPM
    p_o3 = cell_right.add_paragraph()
    p_o3.paragraph_format.space_before = Pt(3)
    p_o3.paragraph_format.space_after = Pt(1)
    p_o3.paragraph_format.line_spacing = 1.05
    r_o3_t = p_o3.add_run('2023 - 2024 | OPPM (Organisasi Pelajar Pondok Modern)\n')
    r_o3_t.font.size = Pt(8.5)
    r_o3_r = p_o3.add_run('Secretary | Language Section')
    r_o3_r.bold = True
    r_o3_r.font.size = Pt(8.5)
    
    o3_bullets = [
        'Mengelola administrasi dan surat-menyurat resmi Divisi Bahasa serta menyusun Laporan Pertanggungjawaban (LPJ) tahunan.',
        'Menegakkan dan memantau disiplin bilingual (Bahasa Arab dan Inggris) santri secara aktif.'
    ]
    for b in o3_bullets:
        p_b = cell_right.add_paragraph()
        add_bullet_item(p_b, [b], space_after=1.5)

    output_path = os.path.abspath('CV_Adridinan_Najmi_Faza.docx')
    doc.save(output_path)
    print(f'CV DOCX successfully generated at: {output_path}')

if __name__ == '__main__':
    build_cv()
