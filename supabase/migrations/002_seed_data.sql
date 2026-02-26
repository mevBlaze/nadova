-- Nadova Labs Seed Data
-- This populates the database with initial content

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (id, name, slug, description, color, icon, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Metabolic & Weight', 'metabolic-weight', 'Fat loss, metabolism, insulin sensitivity', '#f97316', 'flame', 1),
('c2000000-0000-0000-0000-000000000002', 'Anti-Aging & Longevity', 'anti-aging', 'Senolytic, mitochondrial, regenerative', '#a855f7', 'clock', 2),
('c3000000-0000-0000-0000-000000000003', 'Tissue Repair', 'tissue-repair', 'Wound healing, tissue regeneration', '#22c55e', 'heart', 3),
('c4000000-0000-0000-0000-000000000004', 'Immune Support', 'immune-support', 'Immune modulation, anti-inflammatory', '#3b82f6', 'shield', 4),
('c5000000-0000-0000-0000-000000000005', 'Hormonal', 'hormonal', 'Growth hormone, reproductive, sexual health', '#ef4444', 'activity', 5),
('c6000000-0000-0000-0000-000000000006', 'Sleep & Stress', 'sleep-stress', 'Sleep quality, stress modulation', '#6366f1', 'moon', 6);

-- ============================================
-- GOALS
-- ============================================
INSERT INTO goals (id, name, slug, description, color, icon, display_order) VALUES
('a1000000-0000-0000-0000-000000000001', 'Lose Weight', 'weight', 'Burn stubborn fat and boost metabolism', '#f97316', 'flame', 1),
('a2000000-0000-0000-0000-000000000002', 'More Energy', 'energy', 'Enhance performance and vitality', '#eab308', 'zap', 2),
('a3000000-0000-0000-0000-000000000003', 'Anti-Aging', 'aging', 'Reverse cellular aging and restore youth', '#a855f7', 'clock', 3),
('a4000000-0000-0000-0000-000000000004', 'Sleep Better', 'sleep', 'Deep, restorative sleep every night', '#6366f1', 'moon', 4),
('a5000000-0000-0000-0000-000000000005', 'Recover Faster', 'recovery', 'Heal injuries and repair tissue', '#22c55e', 'heart', 5),
('a6000000-0000-0000-0000-000000000006', 'Build Muscle', 'muscle', 'Increase strength and lean mass', '#ef4444', 'dumbbell', 6),
('a7000000-0000-0000-0000-000000000007', 'Gut Health', 'gut', 'Heal and restore digestive wellness', '#14b8a6', 'activity', 7),
('a8000000-0000-0000-0000-000000000008', 'Immunity', 'immunity', 'Strengthen immune defenses', '#3b82f6', 'shield', 8);

-- ============================================
-- PRODUCTS
-- ============================================

-- 1. 5-Amino-1MQ
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color, is_featured, is_new) VALUES
('b1000000-0000-0000-0000-000000000001', 'GEN-1MQ', '5-Amino-1MQ', '5-amino-1mq', 'Burn Stubborn Fat Without Extreme Diets', '5-Amino-1MQ is a small-molecule inhibitor of the enzyme nicotinamide N-methyltransferase (NNMT). Despite being sold on peptide websites, it is technically not a peptide but a modified quinoline compound. NNMT is an enzyme linked to metabolic rate regulation, fat storage, and cellular energy balance.', '50mg', '99%+', 'NEW', 'c1000000-0000-0000-0000-000000000001', 'Primary Target: NNMT enzyme inhibition. Key Pathway: Inhibits NNMT flux → Amplifies NAD+ cycle → Drives lipolytic gene expression. Result: Reduced intracellular MNA, increased intracellular NAD+, suppressed lipogenesis.', 'High selectivity - does not inhibit related SAM-dependent methyltransferases. Does not affect enzymes in NAD+ salvage pathways. No significant impact on food intake observed. No observable adverse effects in animal studies.', 'NOT FDA approved for human use. Legal to buy/possess as research chemical. Cannot be marketed as supplement or medication.', '#f97316', TRUE, TRUE);

-- 2. FOX04-DRI
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color, is_featured, is_new) VALUES
('b2000000-0000-0000-0000-000000000002', 'FOX-GEN04', 'FOX04-DRI', 'fox04-dri', 'Target and Remove Senescent Cells', 'FOX04-DRI (Forkhead Box O4-D-Retro-Inverso) is an experimental senolytic peptide. It is a synthetic D-retro-inverso peptide engineered to disrupt the FOXO4-p53 interaction that allows senescent (aged/dysfunctional) cells to resist natural cell death.', '10mg', '99%+', 'NEW', 'c2000000-0000-0000-0000-000000000002', 'Primary Target: FOXO4-p53 protein interaction. Function: Disrupts the interaction that lets senescent cells survive. Result: p53 is excluded from nucleus → directed to mitochondria → triggers apoptosis exclusively in senescent cells.', 'Experimental status - side effects in humans largely unknown. Potential risks include injection site reactions. Possible off-target effects (fatigue, loss of appetite). Theoretical risk of unintended apoptosis in non-senescent cells.', 'Experimental/Research only. Not approved for human therapeutic use. Primarily preclinical studies.', '#a855f7', TRUE, TRUE);

-- 3. SS-31
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color, is_featured, is_new) VALUES
('b3000000-0000-0000-0000-000000000003', 'SSGEN-31', 'SS-31 (Elamipretide)', 'ss-31', 'Restore Cellular Energy & Reverse Aging', 'SS-31 (also known as Elamipretide, MTP-131, or Bendavia) is a cell-permeable aromatic cationic tetrapeptide that selectively targets and accumulates in the inner mitochondrial membrane. Sequence: D-Arg-Dmt-Lys-Phe-NH2. Molecular Weight: 639.8 g/mol.', '10mg', '99%+', 'NEW', 'c2000000-0000-0000-0000-000000000002', 'Primary Target: Cardiolipin in inner mitochondrial membrane. Functions: Mitigates oxidative stress, suppresses inflammation, maintains mitochondrial dynamics, prevents cellular apoptosis. Key Interaction: Improves adenine nucleotide translocator (ANT) function.', 'Clinical trials in heart failure and mitochondrial myopathy have had mixed results. Continues to show promise for mitochondrial disorders.', 'Investigational drug (Elamipretide). Clinical trials ongoing. Not yet FDA approved for general use.', '#a855f7', TRUE, TRUE);

-- 4. BPC-157
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color, is_featured) VALUES
('b4000000-0000-0000-0000-000000000004', 'BPC-157', 'BPC-157', 'bpc-157', 'Accelerate Injury Recovery & Tissue Repair', 'BPC-157 (Body Protection Compound-157) is a synthetic 15 amino acid peptide fragment first discovered and isolated from human gastric juice. The sequence (Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val) has no homology to other known peptides.', '10mg', '99%+', NULL, 'c3000000-0000-0000-0000-000000000003', 'Primary Pathway: Activates VEGF receptor 2 (VEGFR2) pathway. Angiogenesis: Signals body to create new blood vessels. Growth Factor: Upregulates growth hormone receptor expression in tendon fibroblasts. Result: Enhanced delivery of oxygen, nutrients, and repair materials to damaged tissues.', 'No randomized clinical trials in humans as of current date. Only one small retrospective study (12 patients). FDA named BPC-157 a Category 2 bulk drug substance (2023). Theoretical concerns about cancer promotion due to angiogenesis. Prohibited by WADA.', 'NOT FDA approved for any indication. Research compound only. Cannot be marketed for human use.', '#22c55e', TRUE);

-- 5. DSIP
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b5000000-0000-0000-0000-000000000005', 'DSIP-20', 'DSIP', 'dsip', 'Deep, Restorative Sleep Every Night', 'DSIP (Delta Sleep-Inducing Peptide) is a small nonapeptide (9 amino acids) first discovered in 1974. Sequence: Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu (WAGGDASGE). Can freely cross the blood-brain barrier. Found in human milk at 10-30 ng/mL.', '20mg', '99%+', NULL, 'c6000000-0000-0000-0000-000000000006', 'Primary Effect: Promotes slow-wave (delta) sleep. HPA Axis: Regulates hypothalamic-pituitary-adrenal axis. Hormonal: Stimulates somatoliberin and somatotrophin secretion. Inhibits somatostatin secretion.', 'Short-term treatment of chronic insomnia may not provide major therapeutic benefit. Long-term safety and side effects not established. Research compound only.', 'Research compound only. Not FDA approved. Does not carry manufacturing standards of approved medications.', '#6366f1');

-- 6. Thymalin
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b6000000-0000-0000-0000-000000000006', 'THYMALIN-10', 'Thymalin', 'thymalin', 'Restore Immune Function & Slow Aging', 'Thymalin is a natural polypeptide extract derived from the thymus gland of young calves, originally developed in Russia (1977). It belongs to cytomedins - short peptide bioregulators that influence DNA transcription and cellular differentiation.', '10mg', '99%+', NULL, 'c4000000-0000-0000-0000-000000000004', 'Primary Target: Thymus gland stimulation. T-Cell Enhancement: Stimulates differentiation and activity of T-lymphocytes (CD4+ and CD8+ cells). Gene Regulation: Influences immune function, inflammation, and cellular aging.', 'Therapeutic safety is a key feature. Even long-term use does not cause side effects (per Russian clinical experience). Over 40 years of clinical use in Russia and Eastern Europe.', 'NOT FDA approved in United States. Approved and widely used in Russia and Eastern Europe. Classified as research peptide in US.', '#3b82f6');

-- 7. GHK-Cu
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b7000000-0000-0000-0000-000000000007', 'GHK-CU-25', 'GHK-Cu', 'ghk-cu', 'Regenerate Skin & Boost Collagen Production', 'GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring tripeptide present in human plasma, saliva, and urine. Plasma levels decline from ~200 ng/ml at age 20 to ~80 ng/ml at age 60.', '25mg', '99%+', NULL, 'c2000000-0000-0000-0000-000000000002', 'Primary Function: Stimulates collagen, elastin, and glycosaminoglycan synthesis. Blood Vessels: Promotes angiogenesis. Nerve Growth: Increases nerve outgrowth. Fibroblasts: Supports dermal fibroblast function.', 'Available in cosmetic formulations with established safety. Short in vivo half-life (~30 min in plasma). Poor skin absorption due to high hydrophilicity.', 'Available in cosmetic formulations. Research peptide for therapeutic applications. Not FDA approved for medical claims.', '#a855f7');

-- 8. Ipamorelin
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b8000000-0000-0000-0000-000000000008', 'IPAM-20', 'Ipamorelin', 'ipamorelin', 'Boost Growth Hormone Naturally', 'Ipamorelin is a pentapeptide (Aib-His-D-2-Nal-D-Phe-Lys-NH2) that displays high growth hormone releasing potency. Originally developed by Novo Nordisk in the late 1990s, it is one of the most selective GHRPs available.', '20mg', '99%+', NULL, 'c5000000-0000-0000-0000-000000000005', 'Primary Target: GHRP receptors. Function: Stimulates natural GH release from pituitary. Selectivity: Does NOT affect ACTH, cortisol, FSH, LH, PRL, or TSH even at 200x ED50 dose.', 'Generally well tolerated. Some concern for increases in blood glucose. May decrease insulin sensitivity. Contraindicated in active cancer, uncontrolled diabetes, severe heart disease, pregnancy.', 'NOT FDA approved for human use. Research peptide. Limited long-term safety data.', '#ef4444');

-- 9. Kisspeptin
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b9000000-0000-0000-0000-000000000009', 'KISS-10', 'Kisspeptin', 'kisspeptin', 'Regulate Reproductive Hormones', 'Kisspeptin was first discovered in 1996 as a metastasis inhibitor in melanoma cell lines. It is a family of peptides derived from the KISS1 gene. Variants include KP54, KP14, KP13, and KP10.', '10mg', '99%+', NULL, 'c5000000-0000-0000-0000-000000000005', 'Primary Target: GnRH neurons. Function: Leading upstream regulator of pulsatile and surge GnRH secretion. Interaction: Works with neurokinin B and dynorphin (KNDy neuropeptides). Result: Controls pulsatile GnRH release.', 'Active clinical research ongoing. Translational research focusing on KNDy system manipulation. Human trials showing promising results.', 'Research compound. Clinical trials ongoing for specific applications. Not yet approved for general therapeutic use.', '#ef4444');

-- 10. KPV
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b1000000-0000-0000-0000-000000000010', 'KPV-10', 'KPV', 'kpv', 'Heal Gut & Reduce Inflammation', 'KPV is a short tripeptide fragment derived from the C-terminal of alpha-melanocyte-stimulating hormone (α-MSH). Consists of Lysine (K) – Proline (P) – Valine (V). Most anti-inflammatory activities of α-MSH can be attributed to this tripeptide.', '10mg', '99%+', NULL, 'c4000000-0000-0000-0000-000000000004', 'Receptors: Binds to melanocortin receptors (MC1R and MC3R). NF-κB Pathway: Blocks inflammatory signaling. Cytokines: Lowers TNF-α, IL-6. Important: Anti-inflammatory effect is PepT1-mediated.', 'Very favorable safety profile in animal models. Naturally occurring tripeptide fragment. Well tolerated without systemic complications.', 'Research compound only. Not FDA approved. Promising preclinical results.', '#14b8a6');

-- 11. LL-37
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b1100000-0000-0000-0000-000000000011', 'LL37-10', 'LL-37', 'll-37', 'Antimicrobial Defense & Wound Healing', 'LL-37 is the only human cathelicidin - a 37-residue peptide named after its N-terminal leucine-leucine motif. Found at different concentrations in many cells, tissues, and body fluids.', '10mg', '99%+', NULL, 'c3000000-0000-0000-0000-000000000003', 'Antimicrobial: Direct killing of bacteria and fungi. Anti-Biofilm: Disrupts bacterial biofilms. LPS Neutralization: Binds and neutralizes lipopolysaccharides. Angiogenesis: Promotes new blood vessel formation.', 'Low proteolytic stability. Potential cytotoxicity at high concentrations. High production costs. Modified analogs being developed.', 'Research compound. LL-37-based analogs promising for next-generation therapies. Not FDA approved.', '#22c55e');

-- 12. MOTS-c
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color, is_featured) VALUES
('b1200000-0000-0000-0000-000000000012', 'MOTSC-40', 'MOTS-c', 'mots-c', 'Get Exercise Benefits Without the Workout', 'MOTS-c (mitochondrial open reading frame of the 12S rRNA-c) is a 16-amino-acid peptide encoded within the mitochondrial 12S rRNA. Regulates insulin sensitivity and metabolic homeostasis. Highly conserved among 14 species.', '40mg', '99%+', NULL, 'c1000000-0000-0000-0000-000000000001', 'Primary Pathway: Folate-AICAR-AMPK pathway. Target Organ: Primarily skeletal muscle. Function: Inhibits folate cycle and de novo purine biosynthesis → AMPK activation.', 'MOTS-c levels decline with age. Emerging understanding may lead to new diabetes therapies.', 'Research compound. Emerging understanding may lead to new therapies. Not FDA approved.', '#eab308', TRUE);

-- 13. PT-141
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b1300000-0000-0000-0000-000000000013', 'PT141-10', 'PT-141 (Bremelanotide)', 'pt-141', 'Enhance Sexual Desire & Arousal', 'PT-141 (Bremelanotide) is a 7 amino acid peptide originally developed as a derivative of Melanotan II. It targets central nervous system pathways rather than peripheral vascular mechanisms.', '10mg', '99%+', NULL, 'c5000000-0000-0000-0000-000000000005', 'Receptors: Selective activation of MC3R/MC4R. Location: Hypothalamus and limbic regions. Function: Enhances sexual desire through neurogenic pathways. In Males: Causes local NO increase → vasodilation → erection.', 'Most common side effect is nausea. Pain at injection site. Headache. Temporary BP increase. Possible skin darkening.', 'FDA APPROVED in 2019 (Vyleesi) for HSDD in premenopausal women. Off-label use in men.', '#ef4444');

-- 14. SLU-PP-332
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b1400000-0000-0000-0000-000000000014', 'SLUPP-20', 'SLU-PP-332', 'slu-pp-332', 'Exercise Mimetic for Metabolic Health', 'SLU-PP-332 is a synthetic small molecule (not technically a peptide) designed to selectively activate estrogen-related receptors (ERRs). Synthetic ERR pan agonist with highest potency for ERRα (EC50 of 98 nM).', '20mg', '99%+', NULL, 'c1000000-0000-0000-0000-000000000001', 'Primary Target: ERRα, ERRβ, ERRγ. Function: Increases mitochondrial function and cellular respiration. Muscle Effect: Increases type IIa oxidative skeletal muscle fibers. Result: Enhanced exercise endurance.', 'Laboratory research compound ONLY. NOT for human or veterinary use.', 'Research compound only. Not approved for any therapeutic use. Preclinical stage.', '#eab308');

-- 15. TB-500
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b1500000-0000-0000-0000-000000000015', 'TB500-10', 'TB-500', 'tb-500', 'Accelerate Healing & Improve Flexibility', 'TB-500 (Thymosin Beta-4 acetate) is a synthetic peptide derived from naturally occurring thymosin beta-4 protein. Originally identified in the thymus gland. Contains 7 amino acids (Ac-LKKTETQ) from full 43aa TB4.', '10mg', '99%+', NULL, 'c3000000-0000-0000-0000-000000000003', 'Primary Function: Binding to G-actin monomers. Effect: Prevents actin polymerization. Results: Enhanced cellular motility, endothelial cell movement. Growth Factor: Upregulates HGF expression.', 'FDA Category 2 bulk drug substance (2023). Not approved for human therapeutic use. Short-term and long-term side effects largely unknown. Theoretical cancer concern.', 'NOT FDA approved. Research compound only. Cannot be commercially compounded.', '#22c55e');

-- 16. Tesamorelin
INSERT INTO products (id, code, name, slug, headline, description, dosage, purity, badge, category_id, mechanism_of_action, safety_profile, regulatory_status, color) VALUES
('b1600000-0000-0000-0000-000000000016', 'TESA-5', 'Tesamorelin', 'tesamorelin', 'Reduce Visceral Fat & Build Muscle', 'Tesamorelin is a synthetic 44 amino acid polypeptide analogue of GHRH. N-terminal modified for improved stability. First FDA approved medication for HIV lipodystrophy.', '5mg', '99%+', NULL, 'c1000000-0000-0000-0000-000000000001', 'Primary Target: GHRH receptors in pituitary. Function: Stimulates GH synthesis and release. Downstream: GH acts on hepatocytes → IGF-1 production. IGF-1 Effects: Growth, apoptosis inhibition, glucose uptake, lipolysis.', 'Not associated with severe side effects in clinical trials. Mild injection site reactions. May cause glucose intolerance. May increase T2DM risk.', 'FDA APPROVED in 2010 for HIV-associated lipodystrophy (Egrifta). Off-label research for other applications.', '#f97316');

-- ============================================
-- PRODUCT BENEFITS (Sample for top products)
-- ============================================

-- 5-Amino-1MQ Benefits
INSERT INTO product_benefits (product_id, title, description, stats, display_order) VALUES
('b1000000-0000-0000-0000-000000000001', 'Weight Loss & Fat Reduction', 'Treatment combined with low-fat diet promoted dramatic whole-body adiposity and weight loss in DIO mice. Rapidly normalizes fat measures.', '150% increased exercise', 1),
('b1000000-0000-0000-0000-000000000001', 'Muscle Strength & Recovery', 'Improved grip strength better than exercise alone in aged mice. Reduced need for muscle recovery.', '150% more running', 2),
('b1000000-0000-0000-0000-000000000001', 'Muscle Regeneration', 'Muscle stem cell proliferation elevated. Nearly 2-fold greater cross-sectional area of muscle fibers.', '2x muscle fiber area', 3),
('b1000000-0000-0000-0000-000000000001', 'Insulin Sensitivity', 'Improved glucose tolerance. Reduced insulin resistance. Essentially reversed diet-induced T2D features.', NULL, 4);

-- BPC-157 Benefits
INSERT INTO product_benefits (product_id, title, description, stats, display_order) VALUES
('b4000000-0000-0000-0000-000000000004', 'Wound Healing & Tissue Repair', 'Demonstrated to promote healing of skin, muscle, bone, ligament, and tendon. Enhanced epithelialization and collagen synthesis.', NULL, 1),
('b4000000-0000-0000-0000-000000000004', 'Musculoskeletal Benefits', 'Beneficial effects in tendon ruptures, ligament tears, muscle detachment. Supports bone healing.', NULL, 2),
('b4000000-0000-0000-0000-000000000004', 'Gastrointestinal Health', 'Cytoprotective and pro-healing effects throughout GI tract. Heals ulcers. Benefits in IBD models.', NULL, 3),
('b4000000-0000-0000-0000-000000000004', 'Neuroprotective Properties', 'Benefits in traumatic brain injury, spinal cord compression, peripheral nerve transection healing.', NULL, 4);

-- SS-31 Benefits
INSERT INTO product_benefits (product_id, title, description, stats, display_order) VALUES
('b3000000-0000-0000-0000-000000000003', 'Aging & Exercise Tolerance', 'Reversed age-related decline in maximum mitochondrial ATP production. Increased treadmill endurance.', NULL, 1),
('b3000000-0000-0000-0000-000000000003', 'Cardiac Function', 'Normalized proton leak in old cardiomyocytes. Reduced mitochondrial ROS. Rescues cardiac dysfunction.', NULL, 2),
('b3000000-0000-0000-0000-000000000003', 'Mitochondrial Bioenergetics', 'Improves function, structure, and bioenergetics. Ameliorates organ dysfunction in cardiac and skeletal myopathies.', NULL, 3);

-- MOTS-c Benefits
INSERT INTO product_benefits (product_id, title, description, stats, display_order) VALUES
('b1200000-0000-0000-0000-000000000012', 'Exercise Mimetic Properties', 'Functions as exercise mimetic. Exercise increases MOTS-c levels. Enhanced fatty acid oxidation.', NULL, 1),
('b1200000-0000-0000-0000-000000000012', 'Anti-Aging & Physical Capacity', 'Two weeks treatment significantly increased physical capacity of old mice. Old mice could double running time.', '2x running endurance', 2),
('b1200000-0000-0000-0000-000000000012', 'Insulin Sensitivity', 'Reverses age-related skeletal muscle insulin resistance. Prevents diet-induced obesity.', NULL, 3);

-- TB-500 Benefits
INSERT INTO product_benefits (product_id, title, description, stats, display_order) VALUES
('b1500000-0000-0000-0000-000000000015', 'Wound Healing', 'Increased re-epithelialization by 42% at 4 days, up to 61% at 7 days. Increased collagen and angiogenesis.', '42% faster healing', 1),
('b1500000-0000-0000-0000-000000000015', 'Tissue Repair & Flexibility', 'Faster healing of muscles, tendons, ligaments, and joints. Reduces inflammation.', NULL, 2),
('b1500000-0000-0000-0000-000000000015', 'Cardiac Repair', 'Leading role in aiding cardiac function following hypoxia. Promotes myocardial cell migration.', NULL, 3);

-- DSIP Benefits
INSERT INTO product_benefits (product_id, title, description, stats, display_order) VALUES
('b5000000-0000-0000-0000-000000000005', 'Sleep Quality Improvement', 'Higher sleep efficiency and shorter sleep latency. Sleep increased by 59% within 130 minutes.', '59% more sleep', 1),
('b5000000-0000-0000-0000-000000000005', 'Stress Response Modulation', 'Acts as a stress limiting factor. Reduces cortisol levels when elevated.', NULL, 2),
('b5000000-0000-0000-0000-000000000005', 'Addiction Treatment Support', 'Antagonistic effect on opiate receptors. 97% symptom alleviation in opiate-dependent patients.', '97% alleviation', 3);

-- ============================================
-- PRODUCT-GOAL MAPPINGS
-- ============================================

-- Weight Loss products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 100), -- 5-Amino-1MQ
('b1200000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000001', 90),  -- MOTS-c
('b1400000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000001', 85),  -- SLU-PP-332
('b1600000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000001', 80);  -- Tesamorelin

-- Energy products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b3000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000002', 100), -- SS-31
('b1200000-0000-0000-0000-000000000012', 'a2000000-0000-0000-0000-000000000002', 95),  -- MOTS-c
('b1400000-0000-0000-0000-000000000014', 'a2000000-0000-0000-0000-000000000002', 90),  -- SLU-PP-332
('b1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 85),  -- 5-Amino-1MQ
('b8000000-0000-0000-0000-000000000008', 'a2000000-0000-0000-0000-000000000002', 80);  -- Ipamorelin

-- Anti-Aging products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b2000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000003', 100), -- FOX04-DRI
('b3000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000003', 95),  -- SS-31
('b7000000-0000-0000-0000-000000000007', 'a3000000-0000-0000-0000-000000000003', 90),  -- GHK-Cu
('b1200000-0000-0000-0000-000000000012', 'a3000000-0000-0000-0000-000000000003', 85),  -- MOTS-c
('b6000000-0000-0000-0000-000000000006', 'a3000000-0000-0000-0000-000000000003', 80),  -- Thymalin
('b8000000-0000-0000-0000-000000000008', 'a3000000-0000-0000-0000-000000000003', 75);  -- Ipamorelin

-- Sleep products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b5000000-0000-0000-0000-000000000005', 'a4000000-0000-0000-0000-000000000004', 100), -- DSIP
('b8000000-0000-0000-0000-000000000008', 'a4000000-0000-0000-0000-000000000004', 70);  -- Ipamorelin

-- Recovery products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b4000000-0000-0000-0000-000000000004', 'a5000000-0000-0000-0000-000000000005', 100), -- BPC-157
('b1500000-0000-0000-0000-000000000015', 'a5000000-0000-0000-0000-000000000005', 95),  -- TB-500
('b1100000-0000-0000-0000-000000000011', 'a5000000-0000-0000-0000-000000000005', 85),  -- LL-37
('b7000000-0000-0000-0000-000000000007', 'a5000000-0000-0000-0000-000000000005', 80);  -- GHK-Cu

-- Muscle products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b1000000-0000-0000-0000-000000000001', 'a6000000-0000-0000-0000-000000000006', 95),  -- 5-Amino-1MQ
('b8000000-0000-0000-0000-000000000008', 'a6000000-0000-0000-0000-000000000006', 100), -- Ipamorelin
('b1600000-0000-0000-0000-000000000016', 'a6000000-0000-0000-0000-000000000006', 90);  -- Tesamorelin

-- Gut Health products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b1000000-0000-0000-0000-000000000010', 'a7000000-0000-0000-0000-000000000007', 100), -- KPV
('b4000000-0000-0000-0000-000000000004', 'a7000000-0000-0000-0000-000000000007', 90),  -- BPC-157
('b1100000-0000-0000-0000-000000000011', 'a7000000-0000-0000-0000-000000000007', 80);  -- LL-37

-- Immunity products
INSERT INTO product_goals (product_id, goal_id, relevance_score) VALUES
('b6000000-0000-0000-0000-000000000006', 'a8000000-0000-0000-0000-000000000008', 100), -- Thymalin
('b1000000-0000-0000-0000-000000000010', 'a8000000-0000-0000-0000-000000000008', 90),  -- KPV
('b1100000-0000-0000-0000-000000000011', 'a8000000-0000-0000-0000-000000000008', 85);  -- LL-37

-- ============================================
-- RESEARCH REFERENCES (Sample)
-- ============================================

INSERT INTO product_references (product_id, title, url, source, display_order) VALUES
('b1000000-0000-0000-0000-000000000001', 'NNMT inhibitors reverse high fat diet-induced obesity', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5826726/', 'PMC', 1),
('b1000000-0000-0000-0000-000000000001', 'Reduced calorie diet combined with NNMT inhibition', 'https://www.nature.com/articles/s41598-021-03670-5', 'Nature', 2),
('b2000000-0000-0000-0000-000000000002', 'Targeted Apoptosis of Senescent Cells', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5556182/', 'PMC', 1),
('b2000000-0000-0000-0000-000000000002', 'FOXO4-DRI alleviates testosterone insufficiency', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7053614/', 'PMC', 2),
('b3000000-0000-0000-0000-000000000003', 'SS-31 reverses age-related redox stress', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6588449/', 'PMC', 1),
('b3000000-0000-0000-0000-000000000003', 'Late-life restoration of mitochondrial function', 'https://elifesciences.org/articles/55513', 'eLife', 2),
('b4000000-0000-0000-0000-000000000004', 'BPC-157 in Orthopaedic Sports Medicine', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12313605/', 'PMC', 1),
('b4000000-0000-0000-0000-000000000004', 'Musculoskeletal soft tissue healing', 'https://pubmed.ncbi.nlm.nih.gov/30915550/', 'PubMed', 2);

-- ============================================
-- CONTENT BLOCKS (CMS)
-- ============================================

INSERT INTO content_blocks (key, title, content, content_type, page, section) VALUES
('hero_badge', 'Hero Badge', 'Research-Grade Peptides', 'text', 'home', 'hero'),
('hero_title', 'Hero Title', 'Unlock Your Potential', 'text', 'home', 'hero'),
('hero_subtitle', 'Hero Subtitle', 'Premium research compounds backed by science. From fat loss to anti-aging, find the peptide that matches your health goals.', 'text', 'home', 'hero'),
('about_intro', 'About Introduction', 'Nadova Labs provides a premium catalog of high-quality research peptides designed for accuracy, purity, and reliable performance. Our peptides are manufactured under strict quality control standards to meet advanced scientific research requirements.', 'text', 'about', 'intro'),
('quiz_intro', 'Quiz Introduction', 'Answer a few questions and get personalized product recommendations based on your unique health goals.', 'text', 'quiz', 'intro');

-- ============================================
-- QUIZ QUESTIONS
-- ============================================

INSERT INTO quiz_questions (id, question, helper_text, question_type, display_order) VALUES
('d1000000-0000-0000-0000-000000000001', 'What is your primary health goal?', 'Choose the goal that matters most to you right now.', 'single', 1),
('d2000000-0000-0000-0000-000000000002', 'Do you have any specific concerns?', 'Select all that apply to you.', 'multiple', 2),
('d3000000-0000-0000-0000-000000000003', 'What is your age range?', 'This helps us tailor recommendations.', 'single', 3);

-- Quiz Options for Question 1 (Primary Goal)
INSERT INTO quiz_options (id, question_id, label, description, display_order) VALUES
('e1100000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Lose Weight', 'Burn fat and boost metabolism', 1),
('e1200000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'More Energy', 'Increase vitality and performance', 2),
('e1300000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Anti-Aging', 'Slow aging and restore youth', 3),
('e1400000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Better Sleep', 'Improve sleep quality', 4),
('e1500000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Faster Recovery', 'Heal from injuries', 5),
('e1600000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001', 'Build Muscle', 'Increase strength and mass', 6);

-- Quiz Option Weights for Question 1
INSERT INTO quiz_option_weights (option_id, goal_id, weight) VALUES
('e1100000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 100),
('e1200000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 100),
('e1300000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000003', 100),
('e1400000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000004', 100),
('e1500000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000005', 100),
('e1600000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000006', 100);
