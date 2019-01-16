import struct
import hashlib
import os
import shutil
import distutils.dir_util

from shutil import copytree, ignore_patterns

DEFAULT_DISTANCE = 128
DEFAULT_SECURE_LEN = 512
HEADER_SIGNATURE = '\231\107\123\116'
encryption_key = 1024*[0]
g_current_folder = os.path.dirname(__file__)
g_output_folder = os.path.join(g_current_folder, 'mobile')
g_input_folder = os.path.join(g_current_folder, 'temp')
g_key = [0xaaaaaaaa, 0xbbbbbbbb, 0xcccccccc, 0xdddddddd]
g_list_ext = ['.json', '.txt', '.xml','.js']
g_list_ignore = ['.zip', '.rar', '.mp3', '.ogg', '.ttf', '.plist', '.js', '.json','.png','.jpg','.manifest','.xml','.fnt','.ico','.csb','.db']
assets_resource_temp = ""
g_list_assets = []


def create_folder_if_not_exist(folder):
    if not os.path.exists(folder):
        os.makedirs(folder)


class AssetItem:
    def __init__(self):
        self.path = ""
        self.md5 = ""
        self.zipped = False


def load_template():
    global assets_resource_temp
    assets_resource_temp = open('temp.txt').read()
    version = '0.0.0'
    if os.path.exists('version'):
        version = open('version').read()
    print 'Current version: ' + version
    print 'Input new version:'
    version = raw_input()
    assets_resource_temp = assets_resource_temp.replace('@version@', version)
    file_write = open('version', 'w')
    file_write.write(version)
    file_write.close()


def raw_xxtea(v, n, k):
    assert type(v) == type([])
    assert type(k) == type([]) or type(k) == type(())
    assert type(n) == type(1)

    def MX():
        return ((z>>5)^(y<<2)) + ((y>>3)^(z<<4))^(sum^y) + (k[(p & 3)^e]^z)

    def u32(x):
        return x & 0xffffffff

    y = v[0]
    sum = 0
    DELTA = 0x9e3779b9
    if n > 1:       # Encoding
        z = v[n-1]
        q = 6 + 52 / n
        while q > 0:
            q -= 1
            sum = u32(sum + DELTA)
            e = u32(sum >> 2) & 3
            p = 0
            while p < n - 1:
                y = v[p+1]
                z = v[p] = u32(v[p] + MX())
                p += 1
            y = v[0]
            z = v[n-1] = u32(v[n-1] + MX())
        return 0
    elif n < -1:    # Decoding
        n = -n
        q = 6 + 52 / n
        sum = u32(q * DELTA)
        while sum != 0:
            e = u32(sum >> 2) & 3
            p = n - 1
            while p > 0:
                z = v[p-1]
                y = v[p] = u32(v[p] - MX())
                p -= 1
            z = v[n-1]
            y = v[0] = u32(v[0] - MX())
            sum = u32(sum - DELTA)
        return 0
    return 1


def encrypt_data(data, key, secure_len, distance):
    i = 0
    b = 0
    length = len(data)
    key_length = len(key)
    while i < length:
        data[i] ^= key[b] % 256
        if i < secure_len:
            i += 1
        else:
            i += distance
        b += 1
        if b >= key_length:
            b = 0


def encrypt_file(input_file_path, output_file_path):
    if not os.path.exists(os.path.dirname(output_file_path)):
        os.makedirs(os.path.dirname(output_file_path))
    print input_file_path
    with open(input_file_path, 'rb') as input_file:

        data = bytearray(input_file.read())
        secure_len = DEFAULT_SECURE_LEN
        file_name, file_ext = os.path.splitext(input_file_path)
        if any(file_ext in s for s in g_list_ext):
            secure_len = len(data)
        distance = DEFAULT_DISTANCE

        header = struct.pack('!%ds' % len(HEADER_SIGNATURE), HEADER_SIGNATURE)
        header += struct.pack('!i', secure_len)
        header += struct.pack('!h', distance)

        with open(output_file_path, 'wb+') as output_file:
            output_file.write(header)
            encrypt_data(data, encryption_key, secure_len, distance)
            output_file.write(data)


def encrypt_files_in_folder(folder):
    global g_list_assets
    for name in os.listdir(folder):
        file_path = os.path.join(folder, name)
        if os.path.isfile(file_path):
            relative_path = os.path.relpath(file_path, g_input_folder)
            out_path = os.path.join(g_output_folder, relative_path)
            file_name, file_ext = os.path.splitext(file_path)

            if any(file_ext in s for s in g_list_ignore):
                if not os.path.exists(os.path.dirname(out_path)):
                    os.makedirs(os.path.dirname(out_path))
                shutil.copyfile(file_path, out_path)
            else:
                if not os.path.exists(os.path.dirname(out_path)):
                    os.makedirs(os.path.dirname(out_path))
                shutil.copyfile(file_path, out_path)
				
			

            item = AssetItem()
            item.path = relative_path.replace('\\', '/')
            item.md5 = hashlib.md5(open(out_path, 'rb').read()).hexdigest()
            g_list_assets.append(item)
        else:
            encrypt_files_in_folder(file_path)


def write_files_manifest():
    assets_data = ""
    for data in g_list_assets:
        assets_data += '"'
        assets_data += data.path
        assets_data += '":{"md5":"'
        assets_data += data.md5
        assets_data += '"},'
    buf = assets_resource_temp
    buf = buf.replace('@list_assets@', assets_data[:(len(assets_data)-1)])
    file_out = os.path.join(g_output_folder, 'project.manifest')
    file_write = open(file_out, 'w')
    file_write.write(buf)
    file_write.close()


def write_version_file():
    buf = assets_resource_temp
    buf = buf.replace('@list_assets@', '')
    file_out = os.path.join(g_output_folder, 'version.manifest')
    file_write = open(file_out, 'w')
    file_write.write(buf)
    file_write.close()


def copy_to_input(folder_in):
    folder_name = os.path.basename(os.path.normpath(folder_in))
    folder_out = os.path.join(g_input_folder, folder_name)
    distutils.dir_util.copy_tree(folder_in,  folder_out)
	
def copy_to_input_ignore(folder_in):
    folder_name = os.path.basename(os.path.normpath(folder_in))
    folder_out = g_input_folder
    copytree(folder_in,  folder_out , ignore=ignore_patterns('.svn'))


def prepare():

    copy_to_input_ignore(os.path.abspath(os.path.join(g_current_folder, '../publish/html5')))
	
	
#	copy_to_input_ignore(os.path.abspath(os.path.join(g_current_folder, '../publish/html5/build.xml')))
#    copy_to_input(os.path.abspath(os.path.join(g_current_folder, '../res')))
#    copy_to_input(os.path.abspath(os.path.join(g_current_folder, '../ProjectJS/frameworks/js-bindings/script')))
	
#    shutil.copyfile(os.path.join(g_current_folder, '../ProjectJS/main.js'), os.path.join(g_input_folder, "main.js"))
#    shutil.copyfile(os.path.join(g_current_folder, '../ProjectJS/project.json'), os.path.join(g_input_folder, "project.json"))
#    shutil.copyfile(os.path.join(g_current_folder, '../ProjectJS/config.json'), os.path.join(g_input_folder, "config.json"))

def commit_svn():
    cmd = 'svn add --force %s' % g_output_folder
    print cmd
    if os.system(cmd) != 0:
        raise Exception("Commit svn fails!")
    cmd = 'svn ci -m "commit new monopoly version!" %s' % g_output_folder
    print cmd
    if os.system(cmd) != 0:
        raise Exception("Commit svn fails!")


def execute():
    global encryption_key
    encryption_key = 1024*[0]
    raw_xxtea(encryption_key, 1024, g_key)
    encrypt_files_in_folder(g_input_folder)
    write_files_manifest()
    write_version_file()

load_template()
prepare()
execute()
shutil.rmtree(g_input_folder)
#commit_svn()