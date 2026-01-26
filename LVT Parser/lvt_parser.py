import sys
import struct

def float_str(v:float)->str:
    formatted_v_4dp = f"{v:.4f}"
    ret = str(float(formatted_v_4dp))
    if ret == "0.0":
        ret = "0"
    return ret

def parse_lvt_core(f):
    # Read magic number (lvt1)
    magic = f.read(4)
    if magic != b'\x6c\x76\x74\x31':
        raise ValueError("Invalid LVT file format: Magic number mismatch.")

    # Skip unknown bytes
    f.seek(0x0C)

    # Read number of fields and records
    num_fields = struct.unpack("<I", f.read(4))[0]  # int32, little endian
    num_records = struct.unpack("<I", f.read(4))[0]  # int32, little endian

    #print(f"Number of fields: {num_fields}")
    #print(f"Number of records: {num_records}")

    # Read field lengths
    field_lengths = []
    field_titles = []
    fields_str = ""
    bytes_per_record = 0
    for _ in range(num_fields):
        field_length = struct.unpack("<B", f.read(1))[0] # 1 byte for data length
        title_bytes = []
        while True:
            byte = f.read(1)
            if byte == b'\x00':
                break
            title_bytes.append(byte)
        field_title = b''.join(title_bytes).decode('utf-8')
        field_lengths.append(field_length)
        field_titles.append(field_title)
        bytes_per_record += field_length + 1 # +1 for the prefix byte

    print(f"{num_records=} {bytes_per_record=}")    
    print(f"{field_titles=}")
    print(f"{field_lengths=}")

    # Parse records
    records = []
    for i in range(num_records):
        record_values = []
        for field_len in field_lengths:
            prefix = f.read(1)[0] # Read type prefix
            if prefix == 0x01 or prefix==0x02: # int32
                int_bytes = f.read(4)
                if int_bytes[3] >= 0x80 and int_bytes[3] < 0xF0:
                    value = struct.unpack("<I", int_bytes)[0]
                    value = hex(value).upper().replace("0X", "0x") 
                    record_values.append(value)
                else:
                    value = struct.unpack("<i", int_bytes)[0]
                    record_values.append(str(value))
            elif prefix == 0x03: # float
                    value = struct.unpack("<f", f.read(4))[0]
                    record_values.append(float_str(value))
            else:
                # Handle other types or unknown types, for now just read the bytes
                raise Exception(f"unknown type {prefix}")
        records.append(record_values)

    # Output in text format
    print("-" * 40)
    for record in records:
        print(", ".join(record))
    print("-" * 40)
    return field_titles, records


def parse_lvt_file(filepath):
    with open(filepath, 'rb') as f:
        field_titles, records = parse_lvt_core(f)
        with open(filepath + ".csv", 'w', encoding="utf-8") as w:
            w.write(", ".join(field_titles) + "\n")
            for record in records:
                w.write(", ".join(record) + "\n")
       


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python lvt_parser.py <filepath>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    parse_lvt_file(filepath)

