-- 007_demo_seed.sql
-- Seed 5 demo ACTIVE QR codes (q1–q5) so the verified scan page works end-to-end
-- on a fresh deploy. The friend can overwrite these via /admin/qr after onboarding.

INSERT INTO qr_codes (
  code, status, product_name, batch_number, expiration_date,
  concentration, purity, description, storage_info, extra_fields
) VALUES
  (
    'q1', 'active',
    'BPC-157 — Body Protection Compound',
    'BPC-2026-A1',
    '2027-06-30',
    '5 mg / vial',
    '99.2%',
    'BPC-157 is a synthetic peptide fragment derived from a protein found in gastric juice. Research indicates potential roles in tissue repair, gut health, and joint recovery. For research purposes only.',
    '-20°C, protected from light. Reconstitute with bacteriostatic water.',
    '{"CAS": "137525-51-0", "Sequence": "GEPPPGKPADDAGLV", "Molecular Weight": "1419.53 g/mol", "Research Category": "Tissue Repair"}'
  ),
  (
    'q2', 'active',
    'BPC-157 — Body Protection Compound',
    'BPC-2026-A2',
    '2027-06-30',
    '5 mg / vial',
    '99.1%',
    'BPC-157 is a synthetic peptide fragment derived from a protein found in gastric juice. Research indicates potential roles in tissue repair, gut health, and joint recovery. For research purposes only.',
    '-20°C, protected from light. Reconstitute with bacteriostatic water.',
    '{"CAS": "137525-51-0", "Sequence": "GEPPPGKPADDAGLV", "Molecular Weight": "1419.53 g/mol", "Research Category": "Tissue Repair"}'
  ),
  (
    'q3', 'active',
    'TB-500 — Thymosin Beta-4',
    'TB4-2026-B1',
    '2027-09-30',
    '2 mg / vial',
    '98.8%',
    'Thymosin Beta-4 is an actin-sequestering protein that plays roles in cell migration, wound healing, and anti-inflammatory processes. Research suggests potential for muscle and tissue regeneration. For research purposes only.',
    '-20°C. Stable for 18 months when lyophilized. Use within 30 days of reconstitution.',
    '{"CAS": "77591-33-4", "Sequence": "SDKPDMAEIEKFDKSKLKKTETQ", "Molecular Weight": "4963.50 g/mol", "Research Category": "Recovery"}'
  ),
  (
    'q4', 'active',
    'SS-31 — Elamipretide',
    'SS31-2026-C1',
    '2027-03-31',
    '10 mg / vial',
    '99.5%',
    'SS-31 (Elamipretide) is a mitochondria-targeted peptide. Research indicates it may support mitochondrial function and reduce oxidative stress. Studied in models of aging and metabolic function. For research purposes only.',
    '-80°C for long-term storage. -20°C acceptable for up to 3 months.',
    '{"CAS": "736992-21-5", "Sequence": "D-Arg-dimethylTyr-Lys-Phe-NH2", "Molecular Weight": "639.78 g/mol", "Research Category": "Anti-Aging"}'
  ),
  (
    'q5', 'active',
    'MOTS-c',
    'MOTSc-2026-D1',
    '2027-12-31',
    '5 mg / vial',
    '98.6%',
    'MOTS-c is a mitochondrial-derived peptide encoded by the mitochondrial genome. Research suggests potential metabolic regulation properties and may play a role in exercise endurance and insulin sensitivity. For research purposes only.',
    '-20°C. Lyophilized powder. Reconstitute with sterile water.',
    '{"CAS": "1627580-64-6", "Sequence": "MRWQEMGYIFYPRKLR", "Molecular Weight": "2174.50 g/mol", "Research Category": "Metabolic"}'
  )
ON CONFLICT (code) DO UPDATE SET
  status         = EXCLUDED.status,
  product_name   = EXCLUDED.product_name,
  batch_number   = EXCLUDED.batch_number,
  expiration_date = EXCLUDED.expiration_date,
  concentration  = EXCLUDED.concentration,
  purity         = EXCLUDED.purity,
  description    = EXCLUDED.description,
  storage_info   = EXCLUDED.storage_info,
  extra_fields   = EXCLUDED.extra_fields;
