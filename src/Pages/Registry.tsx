import { useState, useEffect, useCallback, FC, MouseEvent, useMemo } from 'react'
import SearchBar from '../Components/registry/SearchBar'
import TreeView from '../Components/registry/TreeView'
import PropertiesPanel from '../Components/registry/PropertiesPanel'
import FileUploader from '../Components/registry/FileUploader'
import { IORegEntry, NodeOf } from '@/types'

const IORegEntries: IORegEntry[] = [
    {
        name: 'IOUserServer(com.apple.bcmwlan-0x100000588)',
        className: 'IOUserServer',
        id: '6807ad85f6f62cef6bf0553a',
        status: 'registered, matched, active, busy 0 (0 ms), retain 83',
        properties: {
            IOUserClientDefaultLockingSetProperties: true,
            IOUserClientDefaultLockingSingleThreadExternalMethod: true,
            IOUserClientEntitlements: false,
            IOUserClientCreator: '"pid 109, com.apple.Driver"',
            IOUserClientDefaultLocking: true,
            IOAssociatedServices: [
                '4294968712',
                '4294968720',
                '4294968722',
                '4294968723',
                '4294968724',
                '4294968725',
                '4294968726',
                '4294968727',
                '4294968728',
                '4294968729',
                '4294968730',
                '4294968731',
                '4294968732',
                '4294968733',
                '4294968735',
                '4294968889',
                '4294968890',
                '4294968891',
                '4294968892',
                '4294968893',
                '4294968894',
                '4294968895',
                '4294968896',
                '4294968897',
                '4294968899',
                '4294968939',
                '4294968940',
                '4294968941',
                '4294968942',
                '4294968943',
                '4294968944',
                '4294968945',
                '4294968946',
                '4294968947',
                '4294968948',
                '4294968988',
                '4294968989',
                '4294968990',
                '4294968991',
                '4294968992',
                '4294968993',
                '4294968994',
                '4294968995',
                '4294968996',
                '4294968997',
                '4294969039',
                '4294969043',
                '4294969046',
                '4294969053',
                '4294969057',
                '4294969118',
                '4294969131',
                '4294969132',
                '4294969133',
                '4294969134',
                '4294969135',
                '4294969136',
                '4294969137',
                '4294969138',
                '4294969139',
                '4294969140',
                '4294969141',
                '4294969142',
                '4294969149',
                '4294969152',
                '4294969153',
                '4294969154',
                '4294969210',
                '4294969252',
                '4294969338',
            ],
            IOPowerManagement: '{"CapabilityFlags"=0,"MaxPowerState"=2,"CurrentPowerState"=0}',
            IOUserServerName: '"com.apple.bcmwlan"',
            IOUserServerTag: 4294968712,
        },
        parentId: '0x100000477',
    },
    {
        name: 'AppleSMC',
        className: 'AppleSMC',
        id: '6807ae21d5848c90755801ef',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleSMC',
            CFBundleIdentifier: 'com.apple.driver.AppleSMC',
            IOProviderClass: 'IOPlatformDevice',
            IONameMatch: ['APP0001', 'smc'],
            IOPMrootDomain: true,
            SMCSystemType: 2,
            RevisionID: 1,
        },
        parentId: 'root-1',
    },
    {
        name: 'IOHIDSystem',
        className: 'IOHIDSystem',
        id: '6807ae21d5848c90755801f0',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOHIDSystem',
            IOMatchCategory: 'IODefaultMatchCategory',
            ScreenResolutionDPI: 220,
            HIDIdleTime: 3000000000,
        },
        parentId: 'root-1',
    },
    {
        name: 'IOGraphicsFamily',
        className: 'IOGraphicsFamily',
        id: '6807ae21d5848c90755801f1',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOGraphicsFamily',
            CFBundleIdentifier: 'com.apple.iokit.IOGraphicsFamily',
            IOMatchCategory: 'IODefaultMatchCategory',
        },
        parentId: 'root-1',
    },
    {
        name: 'AppleM1Controller',
        className: 'AppleM1GraphicsController',
        id: '6807ae21d5848c90755801f2',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleM1GraphicsController',
            CFBundleIdentifier: 'com.apple.driver.AppleM1Controller',
            IOPCIMatch: '0x0000ffff&0x0000ffff',
            'device-id': '0x0002',
            model: 'M1 Integrated GPU',
            'VRAM,totalsize': 8589934592,
            'assigned-memory': 1073741824,
            powerstat: 0,
            'Built-in': true,
        },
        parentId: 'graphics-3000',
    },
    {
        name: 'AppleIntelME',
        className: 'AppleIntelME',
        id: '6807ae21d5848c90755801f3',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleIntelME',
            CFBundleIdentifier: 'com.apple.driver.AppleIntelME',
            IONameMatch: 'intel-me',
            DeviceStatus: 'Ready',
            FirmwareVersion: '11.8.65.3590',
        },
        parentId: 'graphics-3000',
    },
    {
        name: 'IOPCIFamily',
        className: 'IOPCIFamily',
        id: '6807ae21d5848c90755801f5',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOPCIFamily',
            CFBundleIdentifier: 'com.apple.iokit.IOPCIFamily',
            IOMatchCategory: 'IODefaultMatchCategory',
        },
        parentId: 'root-1',
    },
    {
        name: 'pci-bridge',
        className: 'IOPCIBridge',
        id: '6807ae21d5848c90755801f6',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOPCIBridge',
            'acpi-path': 'IOACPIPlatformDevice:/_SB/PC00',
            'acpi-device': 'PC00',
            'built-in': true,
            'class-code': 60400,
            'device-id': 39473,
            'vendor-id': 32902,
            name: 'pci-bridge',
        },
        parentId: 'pci-4000',
    },
    {
        name: 'AppleNVMe',
        className: 'AppleNVMeController',
        id: '6807ae21d5848c90755801f7',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleNVMeController',
            CFBundleIdentifier: 'com.apple.driver.AppleNVMe',
            IOPCIClassMatch: '0x010802&0xFFFFFF',
            'Physical Interconnect': 'PCI-Express',
            'Physical Interconnect Location': 'Internal',
            'Device Characteristics': 'NonRemovable',
            model: 'APPLE SSD AP1024Q',
            capacity: 1024209543168,
        },
        parentId: 'pci-bridge-4001',
    },
    {
        name: 'BCM4378',
        className: 'IOBluetoothFamily',
        id: '6807ae21d5848c90755801f8',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOBluetoothFamily',
            CFBundleIdentifier: 'com.apple.driver.IOBluetoothFamily',
            IOPCIClassMatch: '0x078000&0xFFFF00',
            ChipsetName: 'BCM4378',
            FirmwareVersion: 'v15 c11205',
            'Bluetooth Device Address': 'xx:xx:xx:xx:xx:xx',
            'Supported Features': ['BLE', 'BR/EDR', 'Extended Advertising'],
            'Bluetooth Core Spec': '5.0',
        },
        parentId: 'pci-bridge-4001',
    },
    {
        name: 'IONetworkFamily',
        className: 'IONetworkFamily',
        id: '6807ae21d5848c90755801f9',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IONetworkFamily',
            CFBundleIdentifier: 'com.apple.iokit.IONetworkFamily',
            IOMatchCategory: 'IODefaultMatchCategory',
        },
        parentId: 'root-1',
    },
    {
        name: 'en0',
        className: 'IO80211Interface',
        id: '6807ae21d5848c90755801fb',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IO80211Interface',
            'BSD Name': 'en0',
            IOInterfaceType: 6,
            IOInterfaceUnit: 0,
            IOPrimaryInterface: true,
            IOBuiltin: true,
            IOMACAddress: 'xx:xx:xx:xx:xx:xx',
            IOMaxTransferUnit: 1500,
            IOMediaAddressLength: 6,
        },
        parentId: 'network-5000',
    },
    {
        name: 'en1',
        className: 'IOEthernetInterface',
        id: '6807ae21d5848c90755801fc',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOEthernetInterface',
            'BSD Name': 'en1',
            IOInterfaceType: 6,
            IOInterfaceUnit: 1,
            IOBuiltin: true,
            IOMACAddress: 'yy:yy:yy:yy:yy:yy',
            IOMaxTransferUnit: 1500,
            IOMediaAddressLength: 6,
        },
        parentId: 'network-5000',
    },
    {
        name: 'IOThunderboltFamily',
        className: 'IOThunderboltFamily',
        id: '6807ae21d5848c90755801fd',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOThunderboltFamily',
            CFBundleIdentifier: 'com.apple.driver.IOThunderboltFamily',
            IOMatchCategory: 'IODefaultMatchCategory',
        },
        parentId: 'root-1',
    },
    {
        name: 'IOThunderboltSwitch',
        className: 'IOThunderboltSwitchType3',
        id: '6807ae21d5848c90755801fe',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOThunderboltSwitchType3',
            CFBundleIdentifier: 'com.apple.driver.IOThunderboltFamily',
            IOPCIClassMatch: '0x088000&0xFFFF00',
            'Device UUID': '00000000-0000-0000-0000-000000000000',
            'Vendor ID': 1,
            'Device ID': 14,
            'Revision ID': 1,
            'Port Count': 4,
        },
        parentId: 'tb-6000',
    },
    {
        name: 'USB3.1 Type-C Port 1',
        className: 'AppleUSBCPort',
        id: '6807ae21d5848c90755801ff',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleUSBCPort',
            CFBundleIdentifier: 'com.apple.driver.AppleUSBCPort',
            'USB Port Type': 'TypeC',
            'port-number': 1,
            'port-high-speed': true,
            'port-super-speed': true,
            'port-power': 3000,
            UsbCPortNumber: 1,
        },
        parentId: 'tb-switch-6001',
    },
    {
        name: 'USB3.1 Type-C Port 2',
        className: 'AppleUSBCPort',
        id: '6807ae21d5848c9075580201',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleUSBCPort',
            CFBundleIdentifier: 'com.apple.driver.AppleUSBCPort',
            'USB Port Type': 'TypeC',
            'port-number': 2,
            'port-high-speed': true,
            'port-super-speed': true,
            'port-power': 3000,
            UsbCPortNumber: 2,
        },
        parentId: 'tb-switch-6001',
    },
    {
        name: 'IOUSBHostFamily',
        className: 'IOUSBHostFamily',
        id: '6807ae21d5848c9075580202',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOUSBHostFamily',
            CFBundleIdentifier: 'com.apple.driver.IOUSBHostFamily',
            IOMatchCategory: 'IODefaultMatchCategory',
        },
        parentId: 'root-1',
    },
    {
        name: 'IOUSBHostDevice',
        className: 'IOUSBHostDevice',
        id: '6807ae21d5848c9075580203',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOUSBHostDevice',
            CFBundleIdentifier: 'com.apple.driver.IOUSBHostFamily',
            'USB Product Name': 'Apple Keyboard',
            'USB Vendor Name': 'Apple Inc.',
            idProduct: 591,
            idVendor: 1452,
            'USB Serial Number': 'ABC123456789',
            'USB Address': 1,
            'USB Release': 256,
        },
        parentId: 'usb-7000',
    },
    {
        name: 'IOUSBHostDevice',
        className: 'IOUSBHostDevice',
        id: '6807ae21d5848c9075580204',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'IOUSBHostDevice',
            CFBundleIdentifier: 'com.apple.driver.IOUSBHostFamily',
            'USB Product Name': 'Magic Mouse 2',
            'USB Vendor Name': 'Apple Inc.',
            idProduct: 617,
            idVendor: 1452,
            'USB Serial Number': 'DEF987654321',
            'USB Address': 2,
            'USB Release': 256,
        },
        parentId: 'usb-7000',
    },
    {
        name: 'AppleARMPE',
        className: 'AppleARMPE',
        id: '6808c0d7f32cf3c0a1ee4b0f',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleARMPE',
            CFBundleIdentifier: 'com.apple.driver.AppleARMPlatform',
            IOProviderClass: 'IOPlatformExpertDevice',
        },
        parentId: 'root-1',
    },
    {
        name: 'IOSystemStateNotification',
        className: 'IOSystemStateNotification',
        id: '6808c0d7f32cf3c0a1ee4b10',
        status: 'registered, matched, active',
        properties: {
            'com.apple.iokit.pm.sleepdescription': {
                'com.apple.iokit.pm.sleepreason': 'Idle Sleep',
            },
            'com.apple.iokit.pm.wakedescription': {
                'com.apple.iokit.pm.wakereason': 'AOP.OutboxNotEmpty menu',
            },
        },
        parentId: '0x1000001c5',
    },
    {
        name: 'arm-io',
        className: 'AppleARMIODevice',
        id: '6808c0d7f32cf3c0a1ee4b11',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleARMIODevice',
            IONameMatch: 'arm-io',
        },
        parentId: '0x1000001c5',
    },
    {
        name: 'Root',
        className: 'IORegistryEntry',
        id: 'root-1',
        status: 'active',
        properties: {
            IOKitBuildVersion: 'Darwin Kernel Version 24.3.0',
            OSBuildVersion: '24981',
        },
        parentId: null,
    },
    {
        name: 'AppleARMPE',
        className: 'AppleARMPE',
        id: '6808c1c519a2d6e796d4455e',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleARMPE',
            CFBundleIdentifier: 'com.apple.driver.AppleARMPlatform',
        },
        parentId: 'root-1',
    },
    {
        name: 'IOSystemStateNotification',
        className: 'IOSystemStateNotification',
        id: '6808c1c519a2d6e796d4455f',
        status: 'registered, matched, active',
        properties: {
            'com.apple.iokit.pm.sleepdescription': {
                'com.apple.iokit.pm.sleepreason': 'Idle Sleep',
            },
        },
        parentId: 'arm-pe-1',
    },
    {
        name: 'arm-io',
        className: 'AppleARMIODevice',
        id: '6808c1c519a2d6e796d44560',
        status: 'registered, matched, active',
        properties: {
            IOClass: 'AppleARMIODevice',
        },
        parentId: 'arm-pe-1',
    },
    {
        name: 'AppleIHGFamilyIO',
        className: 'AppleIHGFamilyIO',
        id: '6808c1c519a2d6e796d44561',
        status: 'active',
        properties: {
            IOClass: 'AppleIHGFamilyIO',
        },
        parentId: 'arm-io-1',
    },
    {
        name: 'i2c1',
        className: 'I2CController',
        id: '6808c1c519a2d6e796d44562',
        status: 'active',
        properties: {
            IOClass: 'I2CController',
        },
        parentId: 'ihg-family-1',
    },
    {
        name: 'audio-speaker-left-tweeter',
        className: 'AudioDevice',
        id: '6808c1c519a2d6e796d44563',
        status: 'active',
        properties: {
            Type: 'Speaker',
        },
        parentId: 'i2c-1',
    },
]

const buildTree = (entries: IORegEntry[]): NodeOf<IORegEntry>[] => {
    // Create a map of all devices by ID for quick lookup
    const entryMap = new Map<string, NodeOf<IORegEntry>>()

    // First pass: create all nodes without children
    entries.forEach((device) => {
        entryMap.set(device.id, { ...device, children: [] })
    })

    // Second pass: build parent-child relationships
    const roots: NodeOf<IORegEntry>[] = []

    entries.forEach((device) => {
        const node = entryMap.get(device.id)!

        if (device.parentId && entryMap.has(device.parentId)) {
            // If device has a parent in our map, add it as child
            const parent = entryMap.get(device.parentId)!
            parent.children.push(node)
        } else {
            // If no parent or parent not found, it's a root
            roots.push(node)
        }
    })

    const compareNodes = (a: NodeOf<IORegEntry>, b: NodeOf<IORegEntry>): number => {
        return (a.name || '').localeCompare(b.name || '')
    }

    // Recursive function to sort the tree
    const sortTree = (node: NodeOf<IORegEntry>) => {
        if (node.children && node.children.length > 0) {
            node.children.sort(compareNodes)
            node.children.forEach(sortTree)
        }
    }

    // Sort the tree
    roots.sort((a, b) => {
        // Root always comes first if present
        if (a.name === 'Root') return -1
        if (b.name === 'Root') return 1

        return compareNodes(a, b)
    })
    roots.forEach(sortTree)

    // Expand the first level of children for root nodes
    roots.forEach((root) => {
        root.initiallyExpanded = true
    })

    return roots
}

const Registry: FC<{}> = () => {
    const [entries, setEntries] = useState<IORegEntry[]>([])
    const tree = useMemo(() => buildTree(entries), [entries])
    const [selectedEntry, setSelectedEntry] = useState<NodeOf<IORegEntry> | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(40) // percentage
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        try {
            setEntries(IORegEntries)
        } catch (err) {
            console.error('Error loading devices:', err)
            setError('Failed to load devices. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    // Handle manual resizing with mouse drag
    const startResize = useCallback(
        (e: MouseEvent) => {
            const startX = e.clientX
            const startWidth = leftPanelWidth
            // FIXME: wtf

            const doDrag = (e) => {
                const containerWidth = document.getElementById('registry-container').offsetWidth
                const newWidth = startWidth + ((e.clientX - startX) / containerWidth) * 100
                // Constrain between 20% and 80%
                setLeftPanelWidth(Math.min(80, Math.max(20, newWidth)))
            }

            const stopDrag = () => {
                document.removeEventListener('mousemove', doDrag)
                document.removeEventListener('mouseup', stopDrag)
            }

            document.addEventListener('mousemove', doDrag)
            document.addEventListener('mouseup', stopDrag)
        },
        [leftPanelWidth]
    )

    return (
        <div id="registry-container" className="h-screen flex flex-col bg-gray-900 text-gray-100">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div
                    style={{ width: `${leftPanelWidth}%` }}
                    className="h-full flex flex-col border-r border-gray-700"
                >
                    <div className="p-4 border-b border-gray-700 bg-gray-800">
                        <div className="flex flex-col gap-4">
                            <SearchBar onSearch={(query) => setSearchTerm(query.toLowerCase())} />
                            <FileUploader
                                onUploadComplete={() => {
                                    /*FIXME */
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-gray-900">
                        {loading && (
                            <div className="p-4 text-center">
                                <div className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-gray-400">Loading device tree...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="p-4 text-center text-red-400">{error}</div>
                        )}

                        {!loading && !error && entries.length === 0 && (
                            <div className="p-4 text-center text-gray-400">
                                No devices found. Upload an IOReg log file to begin.
                            </div>
                        )}

                        {!loading && entries.length > 0 && (
                            <TreeView
                                entries={tree}
                                searchTerm={searchTerm}
                                onSelectEntry={setSelectedEntry}
                                selectedEntry={selectedEntry}
                            />
                        )}
                    </div>
                </div>

                {/* Resizer */}
                <div
                    className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize hover:w-1"
                    onMouseDown={startResize}
                />

                {/* Right Panel */}
                <div
                    style={{ width: `${100 - leftPanelWidth}%` }}
                    className="h-full overflow-auto bg-gray-800"
                >
                    <PropertiesPanel entry={selectedEntry} />
                </div>
            </div>
        </div>
    )
}

export default Registry
