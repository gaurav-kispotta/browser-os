import QtQuick 2.3;
import calamares.slideshow 1.0;

Presentation
{
    id: presentation

    function nextSlide() {
        presentation.goToNextSlide()
    }

    Timer {
        id: advanceTimer
        interval: 3000
        onTriggered: nextSlide()
        repeat: true
    }

    Slide {
        Image {
            id: background1
            source: "slide1.png"
            width: 800; height: 600
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
        }
        Text {
            anchors.horizontalCenter: background1.horizontalCenter
            anchors.top: background1.bottom
            text: "Welcome to Browser OS"
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            font.pixelSize: 20
        }
    }

    Slide {
        Image {
            id: background2
            source: "slide2.png"
            width: 800; height: 600
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
        }
        Text {
            anchors.horizontalCenter: background2.horizontalCenter
            anchors.top: background2.bottom
            text: "A Custom Arch Linux Distribution for BROWSER_OS Applications"
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            font.pixelSize: 20
        }
    }

    Slide {
        Image {
            id: background3
            source: "slide3.png"
            width: 800; height: 600
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
        }
        Text {
            anchors.horizontalCenter: background3.horizontalCenter
            anchors.top: background3.bottom
            text: "Features:\n• Automatic boot to browser\n• Custom branding\n• Secure environment\n• Optimized performance"
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            font.pixelSize: 20
        }
    }

    Component.onCompleted: advanceTimer.running = true
} 