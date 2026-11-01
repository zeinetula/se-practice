import base64, zlib, json, sys, os

# Read the FAULTY_VERSIONS from check_sis.py
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'tests'))
import check_sis as c

faulty, ref = c.load_faulty()
for f in faulty:
    print(f['id'], f.get('criterion',''), repr(f['source'][:300]))
    print()
